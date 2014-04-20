'''
	
'''

# external
#from pymongo import MongoClient
#import gridfs

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
					dataSources:	
					timestamp:		new Date() [javascript] when job pushed to queue
				}
			- fs GridFS object
			
	'''

	
	# make sure job has values we need
	try:
		functionName = job['functionName']
		dataSources = job['dataSources']
	except:
		raise TypeError('Job allocator received malformed job')
		return
		
	# check if job exists at all
	if functionName in JOBS_DICT:
		job_fn = JOBS_DICT[functionName]
	else:
		return
	
	