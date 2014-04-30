"""
	Class to handle processing for a file
"""


# external


# internal
from analytics.utils import check_list
from analytics.classes.Cube import Cube

# constants
JUMP_THRESHOLD = 0.4 		# leeway allowed before breaking cube


class Processor(object):
	""" init """
	def __init__(self):
		#self._current_sheet_name = None
		self._previous_length = None
		
		self._current_cube =  Cube() # initialise with a Cube
		self._label_candidates = []
		self._tidbits = []
		self._likely_cubes = []
		
	
	""" Properties """
	
	### Sheet name ###
	@property
	def current_sheet_name(self):
		return self._current_sheet_name
	@current_sheet_name.setter
	def current_sheet_name(self, value):
		if not isinstance(value, str):
			raise TypeError('Expected str type')
			return
		self._current_sheet_name = value
	
	### Previous Row Length ###
	@property
	def previous_length(self):
		return self._previous_length
	@previous_length.setter
	def previous_length(self, value):
		assert isinstance(value, int)
		self._previous_length = value
		
	### Current Cube ###
	
	@property
	def current_cube(self):
		return self._current_cube
	@current_cube.setter
	def current_cube(self, value):
		self._current_cube = value
	
	### Label candidates ###
	@property
	def label_candidates(self):
		return self._label_candidates
	@label_candidates.setter
	def label_candidates(self, value):
		check_list(value, str)
		self._label_candidates = value
		
	### Row lengths ###
	#@property
	#def row_lengths(self):
	#	return self._row_lengths
	#@row_lengths.setter
	#def row_lengths(self, value):
	#	check_list(value, int)
	#	self._row_lengths = value
		
	### Tidbits ###
	@property
	def tidbits(self):
		return self._tidbits
	@tidbits.setter
	def tidbits(self, value):
		check_list(value, str)
		self._tidbits = value
		
	### Likely cubes ###
	@property
	def likely_cubes(self):
		return self._likely_cubes
	@likely_cubes.setter
	def likely_cubes(self, value):
		self._likely_cubes = value


	""" Methods """
	def small_jump(self, new_length):	
		assert isinstance(new_length, int)
		
		# if no other row, consider it a small jump
		if self._previous_length is None:
			return True
			
		smaller_l = min(self._previous_length, new_length)
		bigger_l = max(self._previous_length, new_length)
	
		# ! reasonable difference
		# i.e. if only 2 columns dont want +/-0.4
		diff = max(2, JUMP_THRESHOLD*bigger_l)
		
		return bigger_l - diff <= smaller_l <=  bigger_l + diff