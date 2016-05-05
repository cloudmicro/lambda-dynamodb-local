#!/bin/bash

rm -rf /local_build/$1
mkdir -p /local_build/$1

cp /usr/src/lambda_functions/$1/* /local_build/$1
cp /usr/src/local_events/$1.json /local_build/$1
cp /usr/src/config/* /local_build/$1
cp /usr/src/lib/* /local_build/$1

cd /local_build/$1
if [ -e "package.json" ] ; then
    npm install .
fi

echo "executing $1 function locally:"
lambda-local -l $1.js -h $1_handler -e $1.json