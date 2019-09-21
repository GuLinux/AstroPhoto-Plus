from setuptools import setup, Extension
import pkgconfig
import os


opencv_names = ['opencv', 'opencv3', 'opencv4', 'opencv2']
opencv = None

for name in opencv_names:
    if not opencv and pkgconfig.exists(name):
        opencv = name

if not opencv:
    raise RuntimeError('Opencv not found')

opencv_cflags = pkgconfig.cflags(opencv)
opencv_ldflags = pkgconfig.libs(opencv)

include_dirs = [x[2:] for x in opencv_cflags.split(' ') if x.startswith('-I')]
include_dirs.append('/usr/include/CCfits')
include_dirs.append('/usr/local/include/CCfits')
 

library_dirs = set(['/usr/lib'])
libraries=['CCfits']


cflags = [x for x in opencv_cflags.split(' ') if not x.startswith('-I')]

def parse_lib(lib):
    global library_dirs
    if lib.startswith('-l'):
        return lib[2:]
    if lib.startswith('/'):
        library_dir, library_filename = os.path.split(lib)
        library_dirs.add(library_dir)
        library_name = library_filename[0:library_filename.find('.')]
        if library_name.startswith('lib'):
            library_name = library_name[3:]
        return library_name
    return lib

libraries.extend([parse_lib(x) for x in opencv_ldflags.split(' ')])
libraries = set(libraries)

print(' - libraries: `{}`'.format(libraries))
print(' - cflats: `{}`'.format(cflags))
print(' - library_dirs: `{}`'.format(library_dirs))
print(' - include_dirs: `{}`'.format(include_dirs))
 

native_module = Extension('_image_processing',
    sources = ['image_processing.cpp', 'image_processing_wrap.cxx'],
    libraries = list(libraries),
    library_dirs = list(library_dirs),
    extra_compile_args=['-std=c++14', '-I/usr/include/CCfits', opencv_cflags],
    include_dirs=include_dirs
)

setup (name = 'ImageProcessing',
       version = '0.1.0',
       description = 'Native image processing module for AstroPhoto Plus',
       ext_modules = [native_module])
