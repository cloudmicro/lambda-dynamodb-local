#!/bin/bash

rm -rf /local_build/$1
mkdir -p /local_build/$1

cp /usr/src/lambda_functions/$1/* /local_build/$1
cp /usr/src/local_events/$1.json /local_build/$1
cp /usr/src/config/* /local_build/$1
cp /usr/src/lib/* /local_build/$1

cd /local_build/$1
if [ -e "requirements.txt" ] ; then
    pip -q install -r requirements.txt
fi

echo "executing $1 function locally:"
python-lambda-local -l /local_build -f $1_handler -a "arn:$2" $1.py $1.json