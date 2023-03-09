FROM node:16.18.1-alpine

RUN mkdir -p /usr/src/web_server

WORKDIR /usr/src/web_server

COPY package.json /usr/src/web_server/

# RUN npm i --production

RUN npm i --production --registry=https://registry.npm.taobao.org

COPY . /usr/src/web_server

EXPOSE 7001

CMD npm run start-docker
