FROM node:alpine
VOLUME /app
WORKDIR /app
RUN apk --no-cache add git
VOLUME /app/node_modules
COPY entrypoint /
CMD /entrypoint

