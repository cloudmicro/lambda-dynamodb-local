# AWLess
This is a Docker-driven local run-time for AWS Python Lambda + DynamoDB.
## Usage
All commands are run in the directory containing the docker-compose.yml file
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
Running the following Docker Compose commands will run the "hello" function contained in this project

1. `docker-compose up -d`
2. `docker-compose run --rm -e FUNCTION_NAME=hello lambda`

## Project Structure
Three directories are used to create and test Lambda functions and DynamoDB tables.
###dg_gen
db_gen contains a node.js application that will create DynamoDB tables and populate them with data.

* Json files for Dynamodb table schemas go in `db_gen/tables`
* Sample data json files go in `dg_gen/tabledata`
* The file names of the sample data file and schema file must match in order to populate table with corresponding sample data  

##TODO
* handle errors gracefully in build_docker.sh
    * check for existence of required files and handler name - throw meaningful errors if anything is amiss
* pre-build pip requirements.txt dependancies when docker image is created
    * this will enhance performance of running containers that load packages defined in requirements.txt
* don't make the existence of a resources/local_events/{function_name} a requirement
* pass an arbitrary event to lambda execution
* support Lambda functions invoking Lambda functions