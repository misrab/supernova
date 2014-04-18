import redis
import time, threading

r = redis.StrictRedis(host='localhost', port=6379, db=0)


def checkQueue():
	print 'fooofoo'
	#print r.keys()
	threading.Timer(1, checkQueue).start()
	
	
f = open('.//python/myfile.txt','w')
checkQueue()
s = str(r.keys())
f.write(s)
f.close()