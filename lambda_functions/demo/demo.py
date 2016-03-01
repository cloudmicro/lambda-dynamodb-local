from lambda_utils import *
# from boto3.dynamodb.conditions import Key, Attr
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


@import_config
def demo_handler(event, context, config):
    dynamodb = dynamodb_connect(config)
    words_table = dynamodb.Table(config.Dynamodb.wordsTable)
    words = words_table.scan()
    return words["Items"]
