import os


# splits filename into file_name and file_extension
def split_filename(filename):
	file_name, file_extension = os.path.splitext(filename)
	return file_name, file_extension	