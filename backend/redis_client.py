from redis import StrictRedis, exceptions
import os
from functools import wraps
import json
from app import logger, REDIS_HOST, REDIS_PORT
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
                time.sleep(retry * 5)
                error = e
        if error:
            raise error
    return f_wrapper

class RedisClient:
    CURRENT_VERSION=1
    PREFIX='ap+_'

    def __init__(self):
        logger.info('Connecting to redis server at {}:{}'.format(REDIS_HOST, REDIS_PORT))
        self.client = StrictRedis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        self.version = self.get_version()
        logger.info('Initialized redis, schema version: {}'.format(self.version))
        if self.version != RedisClient.CURRENT_VERSION:
            self.migrate_schema()

    @retry_connection
    def append(self, object_dict, list_name, list_type=None):
        list_full_id, object_full_id = self.__calc_ids(object_dict['id'], list_name, list_type)
        pipe = self.client.pipeline()
        self.__prefix_cmd(pipe, 'lpush', list_full_id, object_full_id)
        self.__prefix_cmd(pipe, 'set', object_full_id, json.dumps(object_dict))
        pipe.execute()

    @retry_connection
    def lookup(self, object_id, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        object_map = self.__prefix_client('get', object_full_id)
        return json.loads(object_map) if object_map else None

    @retry_connection
    def multi_lookup(self, object_ids, list_name, list_type=None):
        # TODO: optimize
        object_full_ids = [RedisClient.PREFIX + self.__calc_ids(object_id, list_name, list_type)[1] for object_id in object_ids]
        object_maps = self.client.mget(object_full_ids)
        return [json.loads(object_map) for object_map in object_maps if object_map]


    @retry_connection
    def update(self, object_id, object_dict, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        self.__prefix_client('set', object_full_id, json.dumps(object_dict))
        
    @retry_connection
    def delete(self, object_id, list_name, list_type=None):
        list_full_id, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        pipe = self.client.pipeline()
        self.__prefix_cmd(pipe, 'delete', object_full_id)
        self.__prefix_cmd(pipe, 'lrem', list_full_id, 0, object_full_id)
        pipe.execute()

    @retry_connection
    def list_length(self, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        return self.__prefix_client('llen', list_full_id)

    @retry_connection
    def item_exists(self, object_id, list_name, list_type=None):
        _, object_full_id = self.__calc_ids(object_id, list_name, list_type)
        return self.__prefix_client('exists', object_full_id)
        
    @retry_connection
    def item_at(self, index, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        return self.__prefix_client('lindex', list_full_id, index)

    @retry_connection
    def list_keys(self, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        full_ids = self.__prefix_client('lrange', list_full_id, 0, -1)
        return [id[len(list_full_id)+1:] for id in full_ids]
        
    @retry_connection
    def list_values(self, list_name, list_type=None):
        ids = self.list_keys(list_name, list_type)
        return [self.lookup(id, list_name, list_type) for id in ids]

    @retry_connection
    def set(self, key, value):
        self.__prefix_client('set', key, value)

    @retry_connection
    def get(self, key, default_value=None):
        value = self.__prefix_client('get', key)
        return value if value else default_value

    @retry_connection
    def dict_set(self, key, value):
        self.__prefix_client('hmset', key, value)

    @retry_connection
    def dict_get(self, key):
        return self.__prefix_client('hgetall', key)

    @retry_connection
    def get_version(self):
        version = self.__prefix_client('get', 'version')
        return int(version) if version else 0

    @retry_connection
    def set_version(self):
        self.__prefix_client('set', 'version', RedisClient.CURRENT_VERSION)

    @retry_connection
    def migrate_schema(self):
        for start_version in range(self.version, RedisClient.CURRENT_VERSION):
            if start_version == 0:
                pass
        self.set_version()

    def __prefix_cmd(self, obj, cmd, key, *args, **kwargs):
        return getattr(obj, cmd)(RedisClient.PREFIX + key, *args, **kwargs)

    def __prefix_client(self, cmd, key, *args, **kwargs):
        return self.__prefix_cmd(self.client, cmd, key, *args, **kwargs)

    def __calc_list_id(self, list_name, list_type=None):
        return ':'.join([list_type, list_name]) if list_type else list_name

    def __calc_ids(self, object_id, list_name, list_type=None):
        list_full_id = self.__calc_list_id(list_name, list_type)
        object_full_id = ':'.join([list_full_id, object_id])
        return list_full_id, object_full_id

redis_client = RedisClient()

