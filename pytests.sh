#!/bin/sh

export P=src
export PYTHONPATH=$P:$PYTHONPATH
export PYTHONPATH=$P/librus_client:$PYTHONPATH
export PYTHONPATH=$P/librus_client/model:$PYTHONPATH
export PYTHONPATH=$P/librus_client/parsers:$PYTHONPATH
export PYTHONPATH=src/test/python:$PYTHONPATH

#pytest -s -ra --cov-report term --cov-report xml --cov=src/main -m "not glue"
coverage run --branch --omit=*/__init__.py --source=src -m pytest
coverage report --show-missing
coverage html
