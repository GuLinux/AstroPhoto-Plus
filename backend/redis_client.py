from redis import StrictRedis, exceptions
import os
from functools import wraps
import json
from app import logger
import time


def retry_connection(f):
    @wraps(f)
    def f_wrapper(*args, **kwargs):
        retry = 0
        max_retry = 3
        error = None
        while retry < max_retry:
            try:
                return f(*args, **kwargs)
            except exceptions.ConnectionError as e:
                logger.warning('Unable to connect to redis, attempt number {} of {}'.format(retry + 1, max_retry))
                retry += 1
                time.sleep(retry)
                error = e
        if error:
            raise error
    return f_wrapper

class RedisClient:
    def __init__(self):
        redis_host = os.environ.get('REDIS_SERVER', '127.0.0.1')
        redis_port = os.environ.get('REDIS_PORT', 6379) 
        logger.debug('Connecting to redis server at {}:{}'.format(redis_host, redis_port))
        self.client = StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

    @retry_connection
    def append(self, object_dict, list_name, list_type=None):
        list_full_id, object_full_id = self.__calc_ids(object_dict['id'], list_name, list_type)
        pipe = self.client.pipeline()
        pipe.lpush(list_full_id, object_full_id)
        pipe.set(object_full_id, json.dumps(object_dict))
        pipe.execute()

    @retry_connection
    def lookup(self, object_id, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        return json.loads(self.client.get(object_full_id))

    @retry_connection
    def update(self, object_id, object_dict, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        self.client.set(object_full_id, json.dumps(object_dict))
        
    @retry_connection
    def delete(self, object_id, list_name, list_type=None):
        list_full_id, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        pipe = self.client.pipeline()
        pipe.delete(object_full_id)
        pipe.lrem(list_full_id, 0, object_full_id)
        pipe.execute()

    @retry_connection
    def list_length(self, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        return self.client.llen(list_full_id)

    @retry_connection
    def item_exists(self, object_id, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        return self.client.exists(object_full_id)
        
    @retry_connection
    def item_at(self, index, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        return redis_client.lindex(list_full_id, index)

    @retry_connection
    def list_keys(self, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        full_ids = self.client.lrange(list_full_id, 0, -1)
        return [id[len(list_full_id)+1:] for id in full_ids]
        
    @retry_connection
    def list_values(self, list_name, list_type=None):
        ids = self.list_keys(list_name, list_type)
        return [self.lookup(id, list_name, list_type) for id in ids]

    @retry_connection
    def set(self, key, value):
        self.client.set(key, value)

    @retry_connection
    def get(self, key, default_value=None):
        value = self.client.get(key)
        return value if value else default_value

    @retry_connection
    def dict_set(self, key, value):
        self.client.hmset(key, value)

    @retry_connection
    def dict_get(self, key):
        return self.client.hgetall(key)

    def __calc_list_id(self, list_name, list_type=None):
        return ':'.join([list_type, list_name]) if list_type else list_name

    def __calc_ids(self, object_id, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        object_full_id = ':'.join([list_full_id, object_id])
        return list_full_id, object_full_id

redis_client = RedisClient()

