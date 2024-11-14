FROM node:23-alpine as builder
USER root

ARG ref=master
ARG archive_name=assets.zip
ARG assets_path=assets

COPY package*.json .

RUN npm ci

COPY . .

ADD "https://gitgud.io/piefruit/assets/-/archive/$ref/assets.zip" $archive_name
RUN unzip $archive_name -d $assets_path

RUN npm run build

FROM nginx:alpine

COPY --from=builder dist/ /usr/share/nginx/html/