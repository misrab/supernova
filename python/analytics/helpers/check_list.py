


# throw error if not list, or empty list
def check_list(arg, type=None, fn=None):
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