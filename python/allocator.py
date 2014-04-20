'''
	
'''

# external
#from pymongo import MongoClient
import gridfs
import logging

# internal
from analytics.assimilation import extract_cubes




# constants
PENDING_JOBS = 'supernovaJobsPending'
COMPLETED_JOBS = 'supernovaJobsCompleted'
JOBS_DICT = {
	'processFiles':	extract_cubes
}



def allocate_job(fs, job):
	'''
		Input:
			 - JSON job: {
					functionName:	string name of function to run
					dataSources:	array of _id of files in GridFS
					timestamp:		new Date() [javascript] when job pushed to queue
				}
			- fs GridFS object
			
	'''
	#f = open('./python/test.txt', 'w')
	#str = json.dumps(job)
	#f.write(str)
	#f.close()
	
	# make sure job has values we need
	try:
		functionName = job['functionName']
		gridIds = job['dataSources']
	except:
		raise TypeError('Job allocator received malformed job')
		return
		
	# check if job exists at all
	if functionName in JOBS_DICT:
		job_fn = JOBS_DICT[functionName]
	else:
		return
		
	# check if data exists
	#if fs.exists(gridId) == False:
	#	logging.error('Job data source invalid')
	#	return
		
	# test opening file
	f = open('./python/test.txt', 'w')
	f.write(str(fs.list()))
	f.close()
	"""
	if len(gridIds)==0:
		return
	f = open('./python/test.txt', 'w')
	try:
		f.write(fs.get(gridIds[0]).read())
	finally:
		f.close()
	"""
	
	
	