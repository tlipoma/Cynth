import os
from setuptools import setup

def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name = "Cynth_Server",
    version = "0.1",
    author = "Thomas Lipoma",
    author_email = "tlipoma@gmail.com",
    description = (""),
    license = "BSD",
    keywords = "",
    url = "",
    packages=['flask'],
    long_description=read('README'),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Topic :: Utilities",
        "License :: OSI Approved :: BSD License",
    ],
)