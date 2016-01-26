# AWLess
This is a Docker-driven local run-time for AWS Python Lambda + DynamoDB.
## Usage
All Docker and Docker-compose commands are run in the directory containing the docker-compose.yml file
### Mac/Linux
1. `docker-compose up -d`
2. `docker-compose run --rm -e FUNCTION_NAME={your function name} lambda`

**To re-initialize DyanmoDB Tables**

`docker-compose run --rm init`

### Windows
*(this requires Docker Toolbox 1.9.1g and must be run with msysgit/Docker Quickstart terminal)*

1. `docker-compose -f docker-compose.yml -f docker-compose-win.yml -p myproject up -d`
2. `docker run -i --rm -v /$(pwd):/usr/src --add-host=dynamodb:$(docker-machine ip default) -e FUNCTION_NAME={your function name} myproject_lambda`

**To re-initialize DyanmoDB Tables**

`docker start -i init-local`

### For example (Mac/Linux)
Running the following Docker Compose commands will run the _hello_ function contained in this project

1. `docker-compose up -d`
2. `docker-compose run --rm -e FUNCTION_NAME=hello lambda`

## Project Structure
Three directories are used to create and test Lambda functions and DynamoDB tables.
###dg_gen
The `db_gen` directory contains a node.js application that will create DynamoDB tables and populate them with data.

* Json files for DynamoDB table schemas go in `db_gen/tables`
* Sample data json files go in `dg_gen/tabledata`
* The file names of the sample data file and schema file must match in order to populate tables with corresponding sample data

_For example:_

* `tables/words.json` will create a table in DynamoDB Local called "words" with a Hash key called "word" and a Global Secondary Index
on an attribute called "langauge_code"
* `table_data/words.json` will populate the "words" table with about 50 English words

###lambda_functions
Each Lambda function handler file should be placed in a subdirectory under `lambda_functions`. The subdirectory name must
match the name of the handler file and the name of the handler must follow the format `{subdirectory name}_handler`.

_For example:_

* The _hello_ function lives in the following path: `lambda_functions/hello/hello.py`
* The function handler definition within `hello.py` is named `hello_handler`

Each subdirectory under `lambda_functions` can also include a [requirements.txt](https://pip.pypa.io/en/stable/user_guide/#requirements-files)
file that will include any Python package dependancies.

###local_events
Each Lambda function must have a corresponding test event. The test event is a json file whose name must match the corresponding
subdirectory name in `lambda_functions`

_For example:_

* The test event for the _hello_ function is in `local_events/hello.json`

## Integrating your Lambda function with DynamoDB Local
A `@import_config` directive needs to be added to any Lambda function that integrates with DynamoDB.

_For example_, this is how `@import_config` is used in `lambda_functions/demo/demo.py`:

```python
@import_config
def demo_handler(event, context, config):
    dynamodb = dynamodb_connect(config)
    words_table = dynamodb.Table(config.Dynamodb.words)
    words = words_table.scan()
    return words["Items"]
```

More info about this directive (as well as how to handle environment-specific configurations in Python Lambda) can be found
on [my Gist](https://gist.github.com/patrickbrandt/21fc41459fe6a6a19e31). 

##TODO
* handle errors gracefully in build_docker.sh
    * check for existence of required files and handler name - throw meaningful errors if anything is amiss
* pre-build pip requirements.txt dependancies when docker image is created
    * this will enhance performance of running containers that load packages defined in requirements.txt
* don't make the existence of a resources/local_events/{function_name} a requirement
* pass an arbitrary event to lambda execution
* support Lambda functions invoking Lambda functions