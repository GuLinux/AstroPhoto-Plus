import uuid
import six
import functools


__uuid_namespace = uuid.uuid4()

def id_by_properties(properties):
    module_name = properties if isinstance(properties, six.string_types) else '-'.join(properties)
    return uuid.uuid5(__uuid_namespace, module_name).hex



def with_attrs(attrs):
    def with_attrs_decorator(f):
        @functools.wraps(f)
        def f_wrapper(self, *args, **kwargs):
            for attr in attrs:
                if not hasattr(self, attr) or not getattr(self, attr):
                    raise RuntimeError('Method called without {}'.format(attr))
            return f(self, *args, **kwargs)
        return f_wrapper
    return with_attrs_decorator


