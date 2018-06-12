FROM node:alpine
VOLUME /app
WORKDIR /app
RUN apk --no-cache add git
VOLUME /app/node_modules
CMD npm install && npm start

