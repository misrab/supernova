def strip_list(l):
	# for some reason isinstance(x, str) doesn't work
	result = []
	for x in l:
		try:
			result.append(x.strip())
		except:
			result.append(x)
			pass
	return result