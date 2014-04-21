from analytics.helpers import check_list

from analytics.datatypes import Cube


class Processor(object):
	"""
		Persistent class across a bunch of files/sheets being processed to store
		persistent variables for cube finding.
		
		! Mutable objects can be changed by reference, but reassignment won't work:
		we are passing this object (instance) around and expect to alter the one copy
	"""
	
	
	""" Constants & Init """
	CUBE_ROW_THRESHOLD = 10
	
	
	def __init__(self):
		self._row_counter = 0
		self._current_sheet_name = None
		self._current_cube = Cube() # initialise with a Cube
		self._label_candidates = []
		self._row_lengths = []
		self._tidbits = []
		self._likely_cubes = []
		
	
	""" Properties (not all have setters) """

	### Row Counter ###
	@property
	def row_counter(self):
		return self._row_counter
		
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
	@property
	def row_lengths(self):
		return self._row_lengths
	#@row_lengths.setter
	#def row_lengths(self, value):
	#	check_list(value, int)
	#	self._row_lengths = value
		
	### Tidbits ###
	@property
	def tidbits(self):
		return self._tidbits
	@row_lengths.setter
	def tidbits(self, value):
		check_list(value, str)
		self._tidbits = value
		
	### Likely cubes ###
	@property
	def likely_cubes(self):
		return self._likely_cubes
	@row_lengths.setter
	def likely_cubes(self, value):
		self._likely_cubes = value
		
		
		