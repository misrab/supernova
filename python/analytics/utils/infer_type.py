#import xlrd
import re
from dateutil import parser
from datetime import datetime


# field we consider to be as good as empty
EMPTY_FIELDS = ('', '-', '/')


def infer_type(x):
	'''
		Returns guessed (original, type, parsed)
		
		!! does not check excel datetime
	'''
	# Internals
	
	
	
	""" NOT YET POLISHED """
	"""
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
	"""
	
	
	
	
	def is_number(x):
		try:
			float(x)
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
	
	
	# order matters
	if is_empty(x):
		type = 'empty'
		try:
			parsed = ''
		except:
			pass
	elif is_number(x):
		type = 'number'
		try:
			parsed = float(x)
		except:
			pass
		#parsed = parse_number(x)
	elif is_datetime(x):
		type = 'datetime'
		try:
			parsed = parser.parse(x)
		except:
			pass
	else:
		type = 'string'
		parsed = x
		
	return (x, type, parsed)