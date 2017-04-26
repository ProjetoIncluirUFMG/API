FROM node:4-onbuild

MAINTAINER danielmapar@gmail.com

ENV APP_DIR /src
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package.json $APP_DIR
RUN npm install \
  && npm cache clean

COPY . $APP_DIR

EXPOSE 8080

# Run express server
CMD node ./app.js
