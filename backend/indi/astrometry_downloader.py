from .astrometry_indexes import astrometry_indexes
import threading
from errors import BadRequestError, FailedMethodError
from system.settings import settings
import os
from app import logger
import urllib
import requests
import hashlib
import functools

class AstrometryIndexDownloader:
    def __init__(self, event_listener):
        self.event_listener = event_listener
        self.__download_thread = None
        self.downloaded = 0
        self.total = 0

    def download(self, arcminutes):
        if self.__download_thread:
            raise BadRequestError('Already downloading')
        self.downloaded = 0
        fov_limit = arcminutes * 0.1
        files = [f for f in astrometry_indexes if f['arcminutes'] >= fov_limit]
        self.__download_thread = threading.Thread(target=functools.partial(self.__download, files))
        self.__download_thread.start()
        return {
            'files': files,
            'path': settings.astrometry_path()
        }
    
    def __download(self, files):
        os.makedirs(settings.astrometry_path(), exist_ok=True)
        self.total = 0
        missing_files = []
        for file in files:
            if self.__verify(file):
                logger.debug('File {} already downloaded, skipping')
            else:
                self.total += int(requests.head(file['url']).headers['Content-Length'])
                missing_files.append(file)
        logger.debug('Total to download: {} bytes ({} MB)'.format(self.total, self.total / (1024 * 1024)))
        self.event_listener.on_astrometry_index_downloader('starting', {
            'files': missing_files,
            'bytes': self.total,
        })
        for file in missing_files:
            logger.debug('Downloading file: {}'.format(file))
            try:
                self.__download_file(file)
                self.event_listener.on_astrometry_index_downloader('file_finished', {
                    'file': file['filename'],
                })

            except FailedMethodError as e:
                self.event_listener.on_astrometry_index_downloader('error', {
                    'file': file['filename'],
                    'error_message': e.message,
                })
            except Exception as e:
                self.event_listener.on_astrometry_index_downloader('error', {
                    'file': file['filename'],
                    'error_message': str(e),
                })

        self.event_listener.on_astrometry_index_downloader('finished')

        self.__download_thread = None


    def __verify(self, file):
        file_path = settings.astrometry_path(file['filename'])
        if not os.path.exists(file_path):
            return False
        with open(file_path, 'rb') as fileobj:
            m = hashlib.md5()
            while True:
                chunk = fileobj.read(1024)
                if not chunk:
                    break
                m.update(chunk)
            md5sum = m.hexdigest()
            logger.debug('verification for {}: expected={}, got: {}'.format(file['filename'], file['md5sum'], md5sum))
            return md5sum == file['md5sum']

    def __download_file(self, file):
        dest_path = settings.astrometry_path(file['filename'])
        if os.path.exists(dest_path):
            os.remove(dest_path)

        with urllib.request.urlopen(file['url']) as response, open(dest_path, 'wb') as out_file:
            file_progress = 0
            while True:
                file_total = int(response.headers['Content-Length'])
                chunk = response.read(128* 1024)
                if not chunk:
                    break
                chunk_length = len(chunk)
                self.downloaded += chunk_length
                file_progress += chunk_length
                out_file.write(chunk)
                self.event_listener.on_astrometry_index_downloader('progress', {
                    'file': file['filename'],
                    'downloaded': file_progress,
                    'total': file_total,
                    'all_downloaded': self.downloaded,
                    'all_total': self.total,
                })
                # logger.debug('read {} bytes, {} total, {} remaining'.format(len(chunk), self.downloaded, self.total))
            logger.debug('file downloaded: {}'.format(file['filename']))
        if not self.__verify(file):
            raise FailedMethodError('Checksum verification failed')


        
