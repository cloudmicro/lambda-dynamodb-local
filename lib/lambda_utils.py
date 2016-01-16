# from: http://docs.aws.amazon.com/lambda/latest/dg/python-logging.html
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def get_env(context):
    split_arn = context.invoked_function_arn.split(':')
    env = split_arn[len(split_arn) - 1]
    return env


def import_config(f):
    def wrapper(*args, **kwargs):
        context = args[1]
        env = get_env(context)
        logger.info('environemnt: {}'.format(env))

        config = __import__(env + '-config')
        logger.info('imported config: {}'.format(config))

        args += (config,)
        return f(*args, **kwargs)
    return wrapper

