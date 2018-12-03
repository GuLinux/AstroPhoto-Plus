FROM node:alpine
VOLUME /app
WORKDIR /app
RUN apk --no-cache add git
VOLUME /app/node_modules
VOLUME /app/public/themes
VOLUME /app/public/celestial
COPY entrypoint /
CMD /entrypoint

