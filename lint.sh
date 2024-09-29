#!/bin/sh

#pylint -f colorized -j 0 -r y --fail-under=8 src
flake8 --statistic --count --config .flake8 src
exit $?
