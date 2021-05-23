FROM nginx
WORKDIR /usr/share/nginx/html
COPY ./dist/spa /usr/share/nginx/html
EXPOSE 80