# external imports
import numpy as np

# internal imports
from analytics.helpers import check_list # as check_list
from analytics.helpers import infer_type # as infer_type

# constants
TYPE_TO_INDEX = { 'excel_datetime':0, 'datetime': 1, 'number': 2, 'string': 3, 'empty': 4 } # see infer_type.py
TYPES = [ 'excel_datetime', 'datetime', 'number', 'string', 'empty' ]

class Cube(object):
	'''
		Brief Description:
			data structure to represent contiguous blocks of data in csv-like file
		
		Constructor Input:
			n/a
			
		API:
			properties
				- num_rows:		number of non-empty rows
				- labels:		string labels for each column (None if no label for given column)
				- types:		an array of types for each column. entries of invalid type are as good as empty
				- tidbits:		tidbits exclusively preceding cube (tidbits are singleton rows in data file)
				
				- data_path:	path to .csv file for data, on disk or the cloud. Labels and batteries not included
				- _data:		NOT a property! this is to play with the data in main memory. After a cube
								is complete data should be written to a .csv file, either to disk or cloud storage
			
			methods
				- complete:		finalise tidbits, labels, and types
				- get_row:		get row from data at index
				- add_row:		add new row to data. see input expected
			
	'''
	
	
	#################
	#				#
	#  Constructor  #
	#				#
	#################
	
	
	def __init__(self):
		self._num_rows = 0
		#self._num_cols = 0 # now assumed to be defined by labels
		self._labels = []
		self._types = []
		self._tidbits = []
		
		self._data_path = ''
		self._data = []
		self._type_counts = {}
		
	#################
	#				#
	#  Properties   #
	#				#
	#################

	@property
	def num_rows(self):
		"""Number of non-empty rows in cube data"""
		return self._num_rows
	@num_rows.setter
	def num_rows(self, value):
		if not isinstance(value, int):
			raise TypeError('Expected int type')
		self._num_rows = value
	
	
	@property
	def num_cols(self):
		"""Simply defined as length of labels array"""
		return len(self._labels)
	
	'''
	@property
	def num_cols(self):
		"""Maximum number of columns in cube data"""
		return self._num_cols
	@num_cols.setter
	def num_cols(self, value):
		if not isinstance(value, int):
			raise TypeError('Expected int type')
		self._num_cols = value
	'''
	
	@property
	def labels(self):
		"""List of column labels of cube data of maximum column length"""
		return self._labels
	@labels.setter
	def labels(self, arr):
		if not isinstance(arr, list):
			raise TypeError('Expected list type')
		self._labels = arr
		
	@property
	def types(self):
		"""List of column types of cube data of maximum column length"""
		return self._types
	@types.setter
	def types(self, arr):
		if not isinstance(arr, list):
			raise TypeError('Expected list type')
		self._types = arr
		
	@property
	def tidbits(self):
		"""List of tidbits found for this cube"""
		return self._tidbits
	@tidbits.setter
	def tidbits(self, arr):
		if not isinstance(arr, list):
			raise TypeError('Expected list type')
	
		self._tidbits = arr
		
	@property
	def data_path(self):
		"""Path to .csv data on disk or cloud"""
		return self._data_path
	@data_path.setter
	def data_path(self, v):
		if not isinstance(v, str):
			raise TypeError('Expected string path')
			
		self._data_path = v
		
	#########################
	#						#
	#  Private Methods   	#
	#						#
	#########################
	
	
	# infers type per COLUMN, sets self.types
	# subsequently parses every row and empties invalid types
	# !! don't search for invalids if type is unanimous
	# !! using length of labels
	# TODO: not searching for invalids at all now
	def _set_types(self):
		types = ['' for i in range(len(self.labels))]
	
		for column, counts in self._type_counts.items():
			types[column] = TYPES[counts.index(max(counts))]
			
		self.types = types
	
	# we'll take a candidate label row if they're close to the average length of up to the following rows
	def _set_labels(self, candidate_labels, prev_cube_labels):
	
		FOLLOWING_ROWS_CAP = 10
		THRESHOLD = 0.2
		length_sum = 0
		for i in range(FOLLOWING_ROWS_CAP):
			if i >= len(self._data):
				break
			length_sum = length_sum + len(self._data[i])
		
		mean = 1.00*length_sum / (i+1)
			
		for candidate in candidate_labels:
			if mean-THRESHOLD*mean <= len(candidate) <= mean+THRESHOLD*mean:
				self.labels = candidate
				return
		
		# by default just take prev cube labels ([] if none)
		self.labels = prev_cube_labels
		
		
	# takes array of tuples [ ( value , type)... ]
	# adds type count for self._type_counts for type inference on COLUMNS
	def _count_types(self, tuples):
		for i in range(len(tuples)):
			value = tuples[i][0]
			type = tuples[i][1]
			
			# index in array to increment { 0: [ here ] }
			idx = TYPE_TO_INDEX[type]
			# check if our dict of counts has that columns yet
			if i in self._type_counts:
				self._type_counts[i][idx] = self._type_counts[i][idx] + 1
			# else instantiate the array
			else:
				self._type_counts[i] = [ 0 for x in TYPE_TO_INDEX ] # need a slot for each possible type
				self._type_counts[i][idx] = 1
				
				
	
	#########################
	#						#
	#  Public Methods   	#
	#						#
	#########################
	
	def complete(self, tidbits, current_sheet_name, candidate_labels, prev_cube_labels):
		"""Finalise tidbits, labels, and types"""
		# set tidbits
		if current_sheet_name is not None:
			tidbits.insert(0, current_sheet_name)
		self.tidbits = tidbits
		
		# set labels
		# do this before the rest so we can estimate number of columns
		self._set_labels(candidate_labels, prev_cube_labels)
		
		# process data based on types
		self._set_types()
		
		
	def add_row(self, tuples):
		"""
			Append new TYPED row to data
			Input:
				array of tuples [ ( value , type)... ]
				types possible (see infer_type.py): 
					[ 'excel_datetime', 'datetime', 'number', 'string', 'empty' ]
			We maintain a dict in the cube of column to type count
			e.g. { 0: [0 0 0 1 7]... }	col 0 has mainly empty fields			
		"""
		check_list(tuples)
		
		self._count_types(tuples)
		values = [ x[0] for x in tuples ]		
		
		self._data.append(values)
		self._num_rows = self._num_rows + 1
		
		
	def get_row(self, index):
		"""Get row from data at index"""
		if not isinstance(index, int):
			raise ValueError('Index must be an integer')
			
		elif index < 0 or index >= len(self._data):
			raise IndexError('Index out of range')
	
		return self._data[index]