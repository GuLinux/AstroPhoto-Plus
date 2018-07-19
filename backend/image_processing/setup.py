from setuptools import setup, Extension
import os
native_module = Extension('_image_processing',
                    sources = ['image_processing.cpp', 'image_processing_wrap.cxx'],
                    libraries = ['opencv_imgproc', 'opencv_core', 'opencv_imgcodecs', 'CCfits'],
            extra_compile_args=['-std=c++14', '-I/usr/include/CCfits'],
        )

setup (name = 'ImageProcessing',
       version = '0.1.0',
       description = 'Native image processing module for StarQuew',
       ext_modules = [native_module])
