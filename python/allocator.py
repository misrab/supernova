'''
	Allocated jobs based on mapping functionName --> JOBS_DICT[functionName]
	Puts completed job to redis with (key, value): (jobId, stringified JSON result)
'''

# external
import json

# internal
from analytics.assimilation import process_files #extract_cubes




# constants
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
	
	
	# blocking call to function
	completedJob = {}
	completedJob['results'] = job_fn(dataSources)
	
	#print completedJob
	
	# push completed job with results
	r.set(jobId, json.dumps(completedJob))
	