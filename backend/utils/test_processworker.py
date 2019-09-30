import mp

@mp.ProcessWorker
class Foo:
    def __init__(self, tag):
        self.tag = tag

    def print_foo(self):
        print('[{}]: foo'.format(self.tag))

    def print_args(self, arg1, arg2='<none>'):
        print('[{}]: {}, {}'.format(self.tag, arg1, arg2))

    def raise_error(self):
        raise RuntimeError('hello world')

    def get_tag(self):
        return self.tag

    def on_run(self):
        pass

    def set_tag(self, tag):
        self.tag = tag

foo = Foo('Foo-Tag')
foo.start()

