import six
import functools
import hashlib


def id_by_properties(properties):
    module_name = properties if isinstance(properties, six.string_types) else '-'.join(properties)
    m = hashlib.md5()
    m.update(str.encode(module_name))
    return m.hexdigest()



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


