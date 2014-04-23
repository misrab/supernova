import os

def remove_local_file(localPath):
	try:
		os.remove(localPath)
	except OSError:
		pass