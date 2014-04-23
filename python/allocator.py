'''
	
'''

# external
#from pymongo import MongoClient
#import gridfs

import json

# internal
from analytics.assimilation import process_files #extract_cubes




# constants
PENDING_JOBS = 'supernovaJobsPending'
COMPLETED_JOBS = 'supernovaJobsCompleted'
JOBS_DICT = {
	'processFiles':	process_files # extract_cubes
}



def allocate_job(job, r):
	'''
		Input:
			 - r:	redis client to push complete job
			 - JSON job: {
					functionName:	string name of function to run
					dataSources:	
					timestamp:		new Date() [javascript] when job pushed to queue
				}
			- functioName's corresponding function MUST return an object. This
			  object will be stringified and put to completed jobs in redis			
			
	'''
	
	# make sure job has values we need
	try:
		jobId = job['id']
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
	
	completedJob = {}
	completedJob['results'] = job_fn(dataSources)
	
	
	
	f = open('./python/test.txt', 'w')
	f.write(json.dumps(completedJob))
	f.close()
	
	# push completed job with results
	r.set(jobId, json.dumps(completedJob))	
	
	#meow = r.get(jobId)
	# test
	#f = open('./python/test.txt', 'w')
	#f.write(json.dumps(meow))
	#f.close()
	
	