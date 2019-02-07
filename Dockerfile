FROM node:latest
WORKDIR /srv/infbase
ADD package* /srv/infbase/
RUN npm install
ADD . .
RUN npm run build --dest=dist
RUN ls

FROM nginx:latest
WORKDIR /var/www/infbase
COPY --from=0 /srv/infbase/dist/. .