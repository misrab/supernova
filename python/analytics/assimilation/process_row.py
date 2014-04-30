"""
	Process a row in list form, from a compatible file already read

	Input:
		- processor object for variables and methods
		- row to be processed (array)
		- sheet_info
			tuple (wb_datemode, sheet, row_index) to deal with date types
			e.g. Cell Types: 0=Empty, 1=Text, 2=Number, 3=Date, 4=Boolean, 5=Error, 6=Blank
				 sht.cell_type(row_index, col_index)
"""

# external

# internal
from analytics.utils import strip_list, trim_row, infer_type
from analytics.classes import Cube

""" Constants """

CUBE_ROW_THRESHOLD = 10		# min rows to be counted as a likely cube
TIDBIT_MAX_LENGTH = 1


""" Helpers """

# returns true if row looks like labels
# 1. full after trimmed
# 2. all strings
def possible_labels(row):
	trimmed = trim_row(row)
	for s in trimmed:
		type = infer_type(s)[1]
		if type != 'string':
			return False
	return True


# true_l in true length of current row
def break_in_cube(processor, true_l, stripped_row, unemptied_row):
	# complete current cube if big enough
	if processor.current_cube.num_rows >= CUBE_ROW_THRESHOLD:
		# prev cube labels if any: we might need them in cube completion
		# ! at least pass [] or error may occur in Cube()._set_labels
		prev_cube_labels = processor.likely_cubes[-1].labels if len(processor.likely_cubes) else []
		# complete this cube
		processor.current_cube.complete(processor.tidbits, processor.current_sheet_name, processor.label_candidates, prev_cube_labels)				
		processor.likely_cubes.append(processor.current_cube)
		# clear tidbits, labels, 
		processor.tidbits = []
		processor.label_candidates = []
	
	# add to possible labels for next cube if appropriate
	if possible_labels(stripped_row):
		processor.label_candidates.append(trim_row(stripped_row))
	# regardless create new cube
	# !! expect garbage collector to clear
	processor.current_cube = Cube()
	
	# if tidbit
	# this comes after we clear tidbits if successful cube, because we want it to go with the next cube
	# if it broke this one :)
	if true_l <= TIDBIT_MAX_LENGTH:
		for tidbit in unemptied_row:
			processor.tidbits.append(tidbit)
			

def add_row_to_cube(processor, stripped_row, excel, sheet_info):
	# indices for getting info from 'sheet_info'
	DATEMODE_INDEX = 0
	SHEET_INDEX = 1
	ROW_INDEX = 2
	# excel cell type (0=Empty, 1=Text, 2=Number, 3=Date, 4=Boolean, 5=Error, 6=Blank)
	EXCEL_DATE_CELL = 3
		

	# !! also do type conversion here to save time
	# pass array of (value, type)
	new_row = []
	for i in range(len(stripped_row)):
		x = stripped_row[i]
		'''
			A bit of explanation here: excel stores dates as numbers. At front there is no way to tell which 
			a cell should be. Cells do tell us though, hence the need for 'sheet_info' in this function.
			Our policy: consider as an excel datetime if explicitly marked; otherwise, we'll consider a number,
			which comes first in the infer_type.py function.
			
			Also see 'Cube.py' add_row function and 'infer_type.py': 
			we are appending an array of tuples (value, type), hence the indexing of infer_type's result
		'''
		if excel==True and sheet_info[SHEET_INDEX].cell_type(sheet_info[ROW_INDEX], i)==EXCEL_DATE_CELL:
			parsed_date = None
			try:
				parsed_date = datetime(*xlrd.xldate_as_tuple(int(x), sheet_info[DATEMODE_INDEX]))
				#(datetime(*xlrd.xldate_as_tuple(int(x), sheet_info[DATEMODE_INDEX]))
			except:
				pass
			new_row.append((parsed_date , 'excel_datetime'))
		else:
			new_row.append((infer_type(x)[2], infer_type(x)[1]))
	
	processor.current_cube.add_row(new_row)


""" Main """

def process_row(processor, row, excel=False, sheet_info=None):
	# strip row fields no matter what
	stripped_row = strip_list(row)
	
	# now remove empty cols for true length (not for storing!)
	unemptied_row = filter(bool, stripped_row)
	
	# append to list of row lengths
	true_l = len(unemptied_row)
		
	# ignore empty rows they shouldn't break a cube
	if true_l==0:
		#processor.increment_row_counter()
		return
		
	# CASE 1: Add row to current cube
	if processor.previous_length is not None and processor.small_jump(true_l):	
		add_row_to_cube(processor, stripped_row, excel, sheet_info)

	# CASE 2: First row, or break in cube
	else:
		break_in_cube(processor, true_l, stripped_row, unemptied_row)	
	
	# update previous length
	processor.previous_length = true_l