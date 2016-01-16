FROM python:2.7
RUN git clone https://github.com/HDE/python-lambda-local.git
RUN pip install ./python-lambda-local
ADD ./run_lambda.sh /usr/bin
# fixing up line-endings in case this container is run in a Windows environment
RUN sed -i -e 's/\r$//' /usr/bin/run_lambda.sh
RUN chmod +x /usr/bin/run_lambda.sh
RUN mkdir -p /usr/src
VOLUME ["/usr/src/"]
ENTRYPOINT exec run_lambda.sh $FUNCTION_NAME docker
