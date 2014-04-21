# external
import os, binascii
from boto.s3.connection import S3Connection
import csv
import xlrd

# internal
from analytics.helpers import check_list, split_filename
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
		for i in range(0, 1): #testing
		#for i in range(0, excelbook.nsheets):
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
		

# determine file type, read data and process
def process_file(processor, url, fileKey):
	file_name_only, file_extension = split_filename(url)
	
	#data = fileKey.get_contents_as_string()
	# store it in tmp folder with random name + file extension
	tempPath = './tmp/' + binascii.b2a_hex(os.urandom(15)) + file_extension
	fileKey.get_contents_to_filename(tempPath)
	
	
	process_local_file(processor, tempPath, file_extension)
	

"""
	Main Function
"""
# note urls are relative i.e. /files/...., NOT http://amazon.s3....
def process_files(urls):
	check_list(urls)
	
	conn = S3Connection(os.getenv('AWS_ACCESS_KEY_ID'), os.getenv('AWS_SECRET_ACCESS_KEY'))
	bucket = conn.get_bucket(os.getenv('S3_BUCKET_NAME'))
	
	processor = Processor()
	
	for url in urls:
		fileKey = bucket.get_key(url, validate=False)
		process_file(processor, url, fileKey)