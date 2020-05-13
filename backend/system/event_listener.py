from .server_sent_events import sse
from app import logger


class EventListener:
    def on_indiserver_disconnected(self, indi_server, error_code):
        sse.publish_event('indi_server', 'indi_server_disconnect_error', indi_server.to_map(), is_error=True, error_code=error_code)

    def on_indi_message(self, device, message):
        sse.publish_event('indi_server', 'indi_message', {'device': device.to_map(), 'message': message})

    def on_indi_property_updated(self, property):
        sse.publish_event('indi_server', 'indi_property_updated', property.to_map())

    def on_indi_property_added(self, property):
        sse.publish_event('indi_server', 'indi_property_added', property.to_map())

    def on_indi_property_removed(self, property):
        sse.publish_event('indi_server', 'indi_property_removed', property.to_map())

    def on_device_added(self, device):
        sse.publish_event('indi_server', 'indi_device_added', device.to_map())

    def on_device_removed(self, device):
        sse.publish_event('indi_server', 'indi_revice_removed', device.to_map())

    def on_sequence_update(self, sequence):
        sse.publish_event('sequences', 'sequence_updated', sequence.to_map())

    def on_sequence_error(self, sequence, message):
        sse.publish_event('sequences', 'sequence_error', {'sequence': sequence.to_map(), 'error_message': message}, is_error=True)

    def on_indi_service_started(self, drivers, service):
        sse.publish_event('indi_service', 'started', { 'drivers': drivers, 'status': service.status() })

    def on_indi_service_reloaded(self):
        sse.publish_event('indi_service', 'reloaded', {})

    def on_indi_server_reloaded(self):
        sse.publish_event('indi_server', 'reloaded', {})

    def on_sequence_image_saved(self, sequence_job_id, image_id, number, filename):
        sse.publish_event('sequences', 'image_saved', { 'sequence_job': sequence_job_id, 'image_id': image_id, 'number': number, 'filename': filename })
    
    def on_sequence_paused(self, sequence_job_id, notification_message, timeout):
        sse.publish_event('sequences', 'sequence_paused', { 'sequence_job': sequence_job_id, 'notification_message': notification_message, 'notification_timeout': timeout})
    
    def on_astrometry_index_downloader(self, event_type, payload=None):
        sse.publish_event('astrometry_index_downloader', event_type, payload)

    def on_platesolving_message(self, message):
        sse.publish_event('platesolving', 'platesolving_message', {'message': message})

    def on_platesolving_finished(self, payload):
        sse.publish_event('platesolving', 'platesolving_finished', payload, is_error=(payload['status'] == 'error'))

    def on_network_changed(self, payload, is_error=False):
        sse.publish_event('network', 'networks_changed', payload, is_error=is_error)

    def on_indi_service_exit(self, service):
        service_stdout, service_stderr = None, None
        with open(service.stdout_path, 'r') as f:
            service_stdout = f.read()
        with open(service.stderr_path, 'r') as f:
            service_stderr = f.read()

        logger.debug('INDI service exited with exit code {}'.format(service.exit_code()))
        logger.debug('stdout: {}'.format(service_stdout))
        logger.debug('stderr: {}'.format(service_stderr))

        sse.publish_event('indi_service', 'exited', { 'exit_code': service.exit_code(), 'stdout': service_stdout, 'stderr': service_stderr }, is_error=service.is_error())


event_listener = EventListener()
