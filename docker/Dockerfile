FROM node as yarn-build

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

ARG NODE_ENV=production
ARG PUBLIC_URL=/
RUN yarn build

FROM nginx:alpine

WORKDIR /opt/app

COPY docker/vhost.conf /etc/nginx/conf.d/default.conf

COPY --from=yarn-build build/ public/
