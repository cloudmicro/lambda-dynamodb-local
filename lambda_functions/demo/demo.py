from lambda_utils import *
import boto3
from boto3.session import Session
# from boto3.dynamodb.conditions import Key, Attr
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


@import_config
def demo_handler(event, context, config):
    # TODO: put this instantiation logic in its own model class
    if hasattr(config, 'Session'):
        dynamodb = Session(aws_access_key_id=config.Session.access_key,
                           aws_secret_access_key=config.Session.secret_key,
                           region_name=config.Session.region) \
            .resource('dynamodb', endpoint_url=config.Dynamodb.endpoint)
    else:
        dynamodb = boto3.resource('dynamodb', endpoint_url=config.Dynamodb.endpoint)

    words_table = dynamodb.Table(config.Dynamodb.words)
    words = words_table.scan()
    return words["Items"]
