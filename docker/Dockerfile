FROM node:alpine as yarn-build

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

ARG NODE_ENV
ARG PUBLIC_URL
ARG REACT_APP_PHOTO_REFRESH_INTERVAL_IN_SECONDS
ARG REACT_APP_PHOTO_URL
RUN yarn build

FROM nginx:alpine

WORKDIR /opt/app

COPY docker/vhost.conf /etc/nginx/conf.d/default.conf

COPY --from=yarn-build build/ public/
