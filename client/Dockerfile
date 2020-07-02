FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY ./build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# RUN ls /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
