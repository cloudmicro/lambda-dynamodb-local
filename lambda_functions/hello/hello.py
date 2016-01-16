# from: http://docs.aws.amazon.com/lambda/latest/dg/python-logging.html
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# from: http://docs.aws.amazon.com/lambda/latest/dg/python-programming-model-handler-types.html
def hello_handler(event, context):
    message = 'Hello {} {}!'.format(event['first_name'],
                                    event['last_name'])

    return {
        'message' : message
    }