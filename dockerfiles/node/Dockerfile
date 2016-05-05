FROM node:4
RUN npm install -g lambda-local
# install image-magick
RUN apt-get update
RUN apt-get install -y imagemagick --fix-missing
# TODO: find all package.json files and npm install them globally
ADD ./run_lambda_node.sh /usr/bin
# fixing up line-endings in case this container is run in a Windows environment
RUN sed -i -e 's/\r$//' /usr/bin/run_lambda_node.sh
RUN chmod +x /usr/bin/run_lambda_node.sh
RUN mkdir -p /usr/src
VOLUME ["/usr/src/"]
ENTRYPOINT exec run_lambda_node.sh $FUNCTION_NAME docker