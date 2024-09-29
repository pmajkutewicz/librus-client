# Makefile

SHELL := /bin/bash

run_pre_commit:
	source venv/bin/activate && pip -V && pre-commit run --all-file

run_lint: venv_create
	source venv/bin/activate && pip -V && ./lint.sh

run_tests: venv_create
	source venv/bin/activate && pip -V && ./pytests.sh

run_qa: run_lint run_tests

venv_create:
	test -d venv || python3.10 -m venv venv

venv_activate:
	source venv/bin/activate && pip -V

venv_requirements: venv_activate
	pip install -r requirements.txt

venv_deactivate:
	deactivate

build:
	python3 -m pip install --upgrade build
	python3 -m build
	
release_test: build
	python3 -m pip install --upgrade twine
	twine check dist/*
	twine upload --repository testpypi dist/* --config-file .pypirc --verbose
	#twine upload --repository librus-client
