FROM node:lts-alpine
VOLUME /app
WORKDIR /app
RUN apk --no-cache add git python3
VOLUME /app/node_modules
VOLUME /app/public/themes
VOLUME /app/public/celestial
COPY entrypoint /
ENV HOST=0.0.0.0
CMD /entrypoint

