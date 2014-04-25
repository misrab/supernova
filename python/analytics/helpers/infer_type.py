#import xlrd
import re
from dateutil import parser
from datetime import datetime


# field we consider to be as good as empty
EMPTY_FIELDS = ('', '-', '/')


def infer_type(x):
	'''
		Returns guessed type for an item and parses it
		
		!! does not check excel datetime
	'''
	# Internals
	
	
	
	""" NOT YET POLISHED """
	def parse_number(x):
		# returns parsed number if successful
		def try_float(f):
			try:
				result = float(f)
				return result
			except:
				raise ValueError('Could not parse float')

		# first make sure first digit is numeric
		if len(x)==0:
			raise ValueError('Candidate float string has 0 length')
			return
		try_float(x[0])
		
		# take this number remove following alphanumeric
		r1 = re.compile(r'[\d.]+[^\d.]*')
		a = r1.search(x).group(0)
		# remove alpha
		r2 = re.compile(r'[^\d.]+')
		b = r2.sub('', a)
	
		return try_float(b)
	
	
	def is_number(x):
		try:
			#y = parse_number(x)
			float(x)
			return True
		except ValueError:
			return False
	'''
	def is_excel_date(x):
		if excel==False:
			return False
		try:
			xlrd.xldate_as_tuple(int(x), 0)
			return True
		except:
			return False
	'''
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
	
	
	# order matters
	"""
	if excel==True:
		# return as a datetime object, not just a tuple
		type = 'excel_datetime'
		# !! do a try catch: excel is never safe!
		try:
			parsed = datetime(*xlrd.xldate_as_tuple(int(x), 0))
		except:
			parsed = None
	"""
	if is_empty(x):
		type = 'empty'
		parsed = ''
	elif is_number(x):
		type = 'number'
		parsed = float(x)
		#parsed = parse_number(x)
	elif is_datetime(x):
		type = 'datetime'
		parsed = parser.parse(x)
	else:
		type = 'string'
		parsed = x
	
	"""
	elif is_excel_date(x):
		# return as a datetime object, not just a tuple
		type = 'excel_datetime'
		# !! do a try catch: excel is never safe!
		try:
			parsed = datetime(*xlrd.xldate_as_tuple(int(x), 0))
		except:
			parsed = None
	"""
		
	return (x, type, parsed)