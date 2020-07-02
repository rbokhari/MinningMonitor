FROM node:11.15.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY ./build ./
EXPOSE 80
ENTRYPOINT [ "node", "index.js" ]
# RUN npm run build
