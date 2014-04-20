'''
	Here we should listen for jobs and pass them to the job allocator, 
	which determines suitable jobs and fetched data
'''

# external
import os
import redis
from pymongo import MongoClient
import gridfs
import threading
import json


# internal
from allocator import allocate_job


# constants
#PENDING_JOBS = 'supernovaJobsPending'
#COMPLETED_JOBS = 'supernovaJobsCompleted'


class Listener(threading.Thread):
    def __init__(self, fs, r):
        threading.Thread.__init__(self)
        self.redis = r
        self.gridfs = fs
    
    def checkQueue(self):
    	r = self.redis    	
    	job = r.rpop('pendingjobs') # brpop doens't work
    	
    	# allocate job as json
    	if job is not None:
    		allocate_job(self.gridfs, json.loads(job))
    	

    # separate checkQueue() from timer logic
    def work(self):
        self.checkQueue()
        threading.Timer(2, self.work).start()
    
    def run(self):
    	self.work()
    	
    	
    	
# returns a redis client
def createRedisClient():
	redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
	r = redis.from_url(redis_url)
	return r

def createMongoClient():
	mongo_url = os.getenv('MONGOHQ_URL', 'mongodb://127.0.0.1/mydb')
	client = MongoClient(mongo_url)
	db = client.mydb
	
	return db

 
if __name__ == "__main__":
	r = createRedisClient()
	db = createMongoClient()
	fs = gridfs.GridFS(db)

	client = Listener(fs, r)
	client.start()