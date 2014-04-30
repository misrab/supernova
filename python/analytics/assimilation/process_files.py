# external
import xlrd

# internal
from analytics.classes import RemoteAgent
from analytics.classes import Processor
from analytics.assimilation.process_row import process_row
from analytics.utils import split_filename

"""
	Constants
"""

EXCEL_EXTENSIONS = ['.xls', '.xlsx']
CSV_EXTENSION = '.csv'


"""
	Helper Functions
"""

# read file based on type and process rows
# with given processor
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
			print row
			process_row(processor, row, excel=False)

# returns cubes from a localFile
# reads file based on extension
# one Processor object per file
def read_local_file(localPath):
	file_name_only, file_extension = split_filename(localPath)
	
	processor = Processor()
	
	if file_extension in EXCEL_EXTENSIONS:
		read_excel_file(processor, localPath)
	elif file_extension == CSV_EXTENSION:
		read_csv_file(processor, localPath)
	else:
		raise ValueError('Unsupported file type. Currently supported are .csv, .xls, .xlsx')
	
	
	
	return processor.likely_cubes


# upload cube data to S3
# convert results to JSON
def process_cubes(cubes):
	results = []
	paths = [] # list of tuples (localPath, remotePath)
	
	for cube in cubes:
		c = {}
		# careful dict vs class with properties
		c['labels'] = cube.labels
		c['tidbits'] = cube.tidbits
		c['types'] = cube.types
		c['num_rows'] = cube.num_rows
		
		# set new path
		localPath = cube.data_path
		# ! could rehash new name, but just removing '.../tmp/'
		AFTER = '/tmp/'
		fileName = localPath[localPath.find(AFTER)+len(AFTER):]
		remotePath = '/datafiles/' + fileName
		paths.append((cube.data_path, remotePath))
		c['data_path'] = remotePath
			
		# append cube to results
		results.append(c)
		
	
	with RemoteAgent() as ra:
		ra.upload_tuples(paths)
	
	return results

"""
	Main
"""

def process_files(paths):
	# list of all cubes
	results = []

	# get files from S3
	localPaths = []
	with RemoteAgent() as ra:
		localPaths = ra.download_files(paths)	
	
	
	# process files
	for path in localPaths:
		cubes = read_local_file(path)
		results.extend(cubes)
	

	"""
	for cube in results:
		print '===== tidsbits: ' + str(cube.tidbits)
		print '===== labels: ' + str(cube.labels)
		print '===== types: ' + str(cube.types)
		print '=== num rows: ' + str(cube.num_rows)
	"""
	
	
	processedCubes = process_cubes(results)
	
	"""
	f = open('./python/test.txt', 'w')
	f.write(str(processedCubes))
	f.close()
	"""
	
	
	return processedCubes