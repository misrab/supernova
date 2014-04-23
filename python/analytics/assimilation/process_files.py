# external
import os, binascii
from boto.s3.connection import S3Connection
from multiprocessing.pool import ThreadPool
import csv
import xlrd
import logging
import json

# for benchmarking
import time

# internal
from analytics.helpers import check_list, split_filename, remove_local_file
from utils import Processor, process_row

"""
	Constants
"""

EXCEL_EXTENSIONS = ['.xls', '.xlsx']
CSV_EXTENSION = '.csv'



"""
	Helper Functions
"""


def read_excel_file(processor, filename):
	with xlrd.open_workbook(filename) as excelbook:
		# cycle sheets
		#for i in range(0, 1): #testing
		for i in range(0, excelbook.nsheets):
			sht = excelbook.sheet_by_index(i)
			# store sheet name to add to all cubes found
			# TODO: what happens if no sheet name
			processor.current_sheet_name = str(sht.name) # cast to string from unicode

			for r in range(sht.nrows):
				row = sht.row_values(r) # method, not array
				process_row(processor, row, excel=True, sheet_info=(excelbook.datemode, sht, r))


def read_csv_file(processor, filename):
	with open(filename, 'rb') as csvfile:
		reader = csv.reader(csvfile)
		for row in reader:
			process_row(processor, row, excel=False)
			

def process_local_file(processor, localPath, file_extension):
	if file_extension in EXCEL_EXTENSIONS:
		read_excel_file(processor, localPath)
	elif file_extension == CSV_EXTENSION:
		read_csv_file(processor, localPath)
	else:
		raise ValueError('Unsupported file type. Currently supported are .csv, .xls, .xlsx')
	
	# remove local file
	remove_local_file(localPath)
	
	"""
	for cube in processor.likely_cubes:
		print '========================== LIKELY CUBE ========================='
		print 'LABELS:  ====> ' + str(cube.labels)
		print 'TIDBITS: ====> ' + str(cube.tidbits)
		print 'ROWS:    ====> ' + str(cube.num_rows)
	"""
	
		

# determine file type, read data and process
# ! for remote files. If local use process_local_file
def process_file(processor, url, fileKey):
	file_name_only, file_extension = split_filename(url)
	
	#data = fileKey.get_contents_as_string()
	# store it in tmp folder with random name + file extension
	tempPath = './tmp/' + binascii.b2a_hex(os.urandom(15)) + file_extension
	fileKey.get_contents_to_filename(tempPath)

	process_local_file(processor, tempPath, file_extension)
	

# processes results into json and returns array of results
def return_results(likely_cubes):
	results = []
	for cube in likely_cubes:
		c = {}
		# careful dict vs class with properties
		c['labels'] = cube.labels
		c['tidbits'] = cube.tidbits
		c['types'] = cube.types
		c['num_rows'] = cube.num_rows
		c['data_path'] = cube.data_path
		results.append(c)
	
	return results


# write local cube.data_path file to S3 and deletes local version
# ! do in parallel
def process_cubes(cubes, bucket):
	def upload(cube):
		localPath = cube.data_path
		# ! could rehash new name, but just removing '.../tmp/'
		AFTER = '/tmp/'
		fileName = localPath[localPath.find(AFTER)+len(AFTER):]
		remotePath = '/datafiles/' + fileName
		try:
			k = bucket.new_key(remotePath)
			k.set_contents_from_filename(localPath)
		except:
			logging.warning('Failed to upload new cube data to S3')
			return
			
		# remove old
		remove_local_file(localPath)
		# update path !URL not relative path!
		cube.data_path = remotePath

	# execute in parallel
	pool = ThreadPool(processes=10)
	pool.map(upload, cubes)
	"""
	for cube in processor.likely_cubes:
		localPath = cube.data_path
		# ! could rehash new name, but just removing '.../tmp/'
		AFTER = '/tmp/'
		fileName = localPath[localPath.find(AFTER)+len(AFTER):]
		remotePath = '/datafiles/' + fileName
		try:
			k = bucket.new_key(remotePath)
			k.set_contents_from_filename(localPath)
		except:
			logging.warning('Failed to upload new cube data to S3')
			return
			
		# remove old
		remove_local_file(localPath)
		# update path !URL not relative path!
		cube.data_path = remotePath
	"""

"""
	Main Function
"""
# note urls are relative i.e. /files/...., NOT http://amazon.s3....
# ! if remote False files are local
def process_files(urls, remote=True):
	start = time.time()

	check_list(urls)
	
	try:
		conn = S3Connection(os.getenv('AWS_ACCESS_KEY_ID'), os.getenv('AWS_SECRET_ACCESS_KEY'))
		bucket = conn.get_bucket(os.getenv('S3_BUCKET_NAME'))
	except:
		logging.error('Failed to fetch files from S3 for processing')
		return []
	
	processor = Processor()
	
	def start_remote(url):
		fileKey = bucket.get_key(url, validate=False)
		process_file(processor, url, fileKey)
		# delete the file from S3
		# ! may want to do this after returning result
		try:
			bucket.delete_key(fileKey)
		except:
			logging.warning('Failed to delete S3 file after processing')
			pass
			
	def start_local(localPath):
		file_name_only, file_extension = split_filename(localPath)
		process_local_file(processor, localPath, file_extension)
	
	
	thread_fn = start_remote if remote else start_local
	pool = ThreadPool(processes=10)
	pool.map(thread_fn, urls)
	
			
	process_cubes(processor.likely_cubes, bucket)
	
		
	stop = time.time()
	print "---------- process files took -------------"
	print "----------     " + str(stop-start) +  "-------------"
		
	return return_results(processor.likely_cubes)