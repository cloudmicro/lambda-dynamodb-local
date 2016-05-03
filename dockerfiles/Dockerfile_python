FROM python:2.7
RUN git clone https://github.com/HDE/python-lambda-local.git
RUN pip install ./python-lambda-local
# TODO: find all requirements.txt files and pip install them
ADD ./run_lambda_python.sh /usr/bin
# fixing up line-endings in case this container is run in a Windows environment
RUN sed -i -e 's/\r$//' /usr/bin/run_lambda_python.sh
RUN chmod +x /usr/bin/run_lambda_python.sh
RUN mkdir -p /usr/src
VOLUME ["/usr/src/"]
ENTRYPOINT exec run_lambda_python.sh $FUNCTION_NAME docker
