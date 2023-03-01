FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js ./
COPY pages pages

EXPOSE 8080

CMD ["node", "server.js"]