# from: http://docs.aws.amazon.com/lambda/latest/dg/python-logging.html
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def get_env(context):
    """This helper function returns the AWS Lambda function Alias for the current Lambda function"""
    # TODO: handle Lambda functions that don't have an alias
    split_arn = context.invoked_function_arn.split(':')
    env = split_arn[len(split_arn) - 1]
    return env


def import_config(f):
    """
    Apply this directive to an AWS Lambda function handler to inject an alias-specific config object
    """
    def wrapper(*args, **kwargs):
        context = args[1]
        env = get_env(context)
        logger.info('environment: {}'.format(env))

        config = __import__(env + '-config')
        logger.info('imported config: {}'.format(config))

        args += (config,)
        return f(*args, **kwargs)
    return wrapper

