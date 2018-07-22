from setuptools import setup, Extension
import pkgconfig
import os

if not pkgconfig.exists('opencv'):
    raise RuntimeError('Opencv not found')

opencv_cflags = pkgconfig.cflags('opencv')
opencv_ldflags = pkgconfig.libs('opencv')

library_dirs = set('/usr/lib')

libraries=['CCfits']

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
print(libraries)

native_module = Extension('_image_processing',
                    sources = ['image_processing.cpp', 'image_processing_wrap.cxx'],
                    libraries = list(libraries),
                    library_dirs = list(library_dirs),
            extra_compile_args=['-std=c++14', '-I/usr/include/CCfits', opencv_cflags],
        )

setup (name = 'ImageProcessing',
       version = '0.1.0',
       description = 'Native image processing module for StarQuew',
       ext_modules = [native_module])
