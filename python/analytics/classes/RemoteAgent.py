"""
	Class to handle file upload/download to/from S3
"""

# external
import os
import binascii
import sys
import logging
from boto.s3.connection import S3Connection
import threading


# internal
from analytics.utils import split_filename, remove_local_file


"""
try:
	self._conn = S3Connection(os.getenv('AWS_ACCESS_KEY_ID'), os.getenv('AWS_SECRET_ACCESS_KEY'))
	self._bucket = self._conn.get_bucket(os.getenv('S3_BUCKET_NAME'))
except:
	logging.error('Failed to establish RemoteAgent connection to S3')
"""

class RemoteAgent(object):
	def __init__(self):
		return
		
	# enter/exit for 'with' statement clean closing		
	def __enter__(self):
		return self
	def __exit__(self, type, value, traceback):
		#self._conn.close()
		return
		
	def download_files(self, urls):
		def _thread(fn, list):
			# Keep track of the threads we create
			threads = []
			results = []
			#def callback(url, results):
			#	result.append(url)
		
			for l in list:
				threads.append(threading.Thread(
					target = fn, 
					args=(l, results)
				))
		
			[ t.start() for t in threads ]
			[ t.join() for t in threads ]
			return results
			#return results
			
		def download(url, results):
			try:
				conn = S3Connection(os.getenv('AWS_ACCESS_KEY_ID'), os.getenv('AWS_SECRET_ACCESS_KEY'))
				bucket = conn.get_bucket(os.getenv('S3_BUCKET_NAME'))
				fileKey = bucket.get_key(url, validate=False)
				file_name_only, file_extension = split_filename(url)
				# write to file
				tempPath = './tmp/' + binascii.b2a_hex(os.urandom(15)) + file_extension
				fileKey.get_contents_to_filename(tempPath)
				results.append(str(tempPath))
				"""
				fileKey = None
				while fileKey is None:
					try:
						# get key
						fileKey = bucket.get_key(url, validate=False)
						file_name_only, file_extension = split_filename(url)
						# write to file
						tempPath = './tmp/' + binascii.b2a_hex(os.urandom(15)) + file_extension
						fileKey.get_contents_to_filename(tempPath)
						# append to results
						results.append(str(tempPath))
						# delete from S3
						bucket.delete_key(fileKey)
					except:
						pass
				"""
			except:
				logging.error('Error connecting to S3')
				
		# return local paths
		lala = _thread(download, urls)
		
		
		f = open('./python/testing.txt', 'w')
		f.write(str(lala))
		f.close()
		
		return lala
		
		
	# upload (oldPath, remotePath)
	def upload_tuples(self, paths):
		def _thread(fn, list):
			# Keep track of the threads we create
			threads = []
		
			for l in list:
				threads.append(threading.Thread(
					target = fn, 
					args=(l[0], l[1])
				))
		
			[ t.start() for t in threads ]
			[ t.join() for t in threads ]
			
		def upload_one_tuple(oldPath, remotePath):
			try:
				conn = S3Connection(os.getenv('AWS_ACCESS_KEY_ID'), os.getenv('AWS_SECRET_ACCESS_KEY'))
				bucket = conn.get_bucket(os.getenv('S3_BUCKET_NAME'))
				k = bucket.new_key(remotePath).set_contents_from_filename(oldPath)
				# remove old
				remove_local_file(oldPath)
			except:
				logging.error('Error uploading file')
				pass
			finally:
				return
		return _thread(upload_one_tuple, paths)