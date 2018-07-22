from redis import StrictRedis
import os
from functools import wraps


class RedisClient:
    def __init__(self):
        self.client = StrictRedis(host=os.environ.get('REDIS_SERVER', 'localhost'), port=os.environ.get('REDIS_PORT', 6379), decode_responses=True)

    def append(self, object_dict, list_name, list_type=None):
        list_full_id, object_full_id = self.__calc_ids(object_dict['id'], list_name, list_type)
        self.client.lpush(list_full_id, object_full_id)
        self.client.hmset(object_full_id, object_dict)

    def lookup(self, object_id, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        return self.client.hgetall(object_full_id)

    def update(self, object_id, object_dict, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        self.client.hmset(object_full_id, object_dict)
        
    def delete(self, object_id, list_name, list_type=None):
        list_full_id, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        self.client.delete(object_full_id)
        self.client.lrem(list_full_id, 0, object_full_id)

    def list_keys(self, list_name, list_type):
        list_full_id = self.__calc_list_id(list_name, list_type)
        full_ids = self.client.lrange(list_full_id, 0, -1)
        return [id[len(list_full_id)+1:] for id in full_ids]
        

    def set(self, key, value):
        self.client.set(name, value)

    def get(self, key, default_value=None):
        value = self.client.get(key)
        return value if value else default_value

    def __calc_list_id(self, list_name, list_type=None):
        return ':'.join([list_type, list_name]) if list_type else list_name

    def __calc_ids(self, object_id, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        object_full_id = ':'.join([list_full_id, object_id])
        return list_full_id, object_full_id
