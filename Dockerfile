FROM node:latest
WORKDIR /srv/infbase
ADD package* /srv/infbase/
RUN npm install
ADD . .
RUN npm build

FROM nginx:latest
WORKDIR /var/www/infbase
COPY --from=0 /srv/infbase/dist/. .
EXPOSE 80
CMD ls