import os



def check_list(arg, type=None, fn=None):
	"""
		Check if 'arg' is a list, and optionally
		if elements of 'type', and optionally
		if 'fn' returns True on elements
	"""
	if not isinstance(arg, list):
		raise TypeError('Input argument must be provided as a list')
		
	#if len(arg) == 0:
	#	raise ValueError('Input argument list should not be empty')
	
	for i in range(0, len(arg)):
		# type check
		if type is not None and not isinstance(arg[i], type):
			raise ValueError('Element at index ' + str(i) + ' is of invalid type')
		# additional custom check
		# fn should check one element in list
		if fn is not None and fn(arg[i])==False:
			raise ValueError('Element at index ' + str(i) + ' did not pass custom check function')
			


def remove_local_file(localPath):
	""" Removes local file, passes if error """
	try:
		os.remove(localPath)
	except OSError:
		pass
		
		
def split_filename(filename):
	""" Splits filename into file_name and file_extension """
	file_name, file_extension = os.path.splitext(filename)
	return file_name, file_extension
	
	
def strip_list(l):
	""" Strips each element of a list, returns new list """
	# for some reason isinstance(x, str) doesn't work
	result = []
	for x in l:
		try:
			result.append(x.strip())
		except:
			result.append(x)
			pass
	return result
	
	

def trim_row(row):
	"""
		Trims a row list, from sides
		expects actual elements to be trimmed already
		!! expects there to be at least one nonempty element
	"""
	try:
		i = 0
		j = len(row)-1
		start = row[i]
		end = row[j]
	
		while start=='' and i < len(row):
			i = i + 1
			start = row[i]
		while end=='' and j > 0:
			j = j - 1
			end = row[j]
	
		# return sublist
		return row[i:j+1]
	except:
		return row
	
	
	
	
	
	
	