import os
import redis
import threading


# redis queue names
PENDING_JOBS = 'supernovaJobsPending'
COMPLETED_JOBS = 'supernovaJobsCompleted'


class Listener(threading.Thread):
    def __init__(self, r, channels):
        threading.Thread.__init__(self)
        self.redis = r
    
    def checkQueue(self):
    	r = self.redis
    	job = r.brpop('supernovaJobsPending')
    	
    
    # separate checkQueue() from timer logic
    def work(self):
        self.checkQueue()
        threading.Timer(1, self.work).start()
    
    def run(self):
    	self.work()
    	
# returns a redis client
def createRedisClient():
	redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
	r = redis.from_url(redis_url)
	#r = redis.StrictRedis(host='localhost', port=6379, db=0)
	return r
	
'''
var redisUrl = url.parse(process.env.REDISTOGO_URL);
var redisAuth = redisUrl.auth.split(':');
var client = redis.createClient(redisUrl.port, redisUrl.hostname);
client.auth(redisAuth[1]);
'''

 
if __name__ == "__main__":
	r = createRedisClient()
	client = Listener(r, ['supernovaJobs'])
	client.start()