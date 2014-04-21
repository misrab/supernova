import xlrd
from dateutil import parser
from datetime import datetime


# field we consider to be as good as empty
EMPTY_FIELDS = ('', '-', '/')

# TODO:
#		- what if valid excel date number should be a number! e.g. 40079
#		- check if string is a location
#		- deal with geolocations
def infer_type(x, excel=False):
	'''
		Returns guessed type for an item and parses it
		
		! if excel datetime expect to check that outside of here (yes, excel is a pain)
		
		Input: item, boolean if drawn from excel
		
		Output: (item, type, parsed_item)
	'''
	# Internals
	def is_number(x):
		try:
			float(x)
			return True
		except ValueError:
			return False
	def is_excel_date(x):
		if excel==False:
			return False
	
		try:
			xlrd.xldate_as_tuple(int(x), 0)
			return True
		except:
			return False
	def is_datetime(x):
		try:
			parser.parse(x)
			return True
		except:
			return False
	def is_empty(x):
		if str(x).strip() in EMPTY_FIELDS:
			return True
		return False
	
	# Vars
	type = None
	parsed = None
	
	
	# order matters e.g. empty would pass excel date
	if is_excel_date(x):
		# return as a datetime object, not just a tuple
		type = 'excel_datetime'
		parsed = datetime(*xlrd.xldate_as_tuple(int(x), 0))
	elif is_number(x):
		type = 'number'
		parsed = float(x)
	elif is_empty(x):
		type = 'empty'
		parsed = ''
	elif is_datetime(x):
		type = 'datetime'
		parsed = parser.parse(x)
	else:
		type = 'string'
		parsed = x
		
	return (x, type, parsed)