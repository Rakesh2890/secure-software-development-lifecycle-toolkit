FROM node:24-alpine

RUN npm install -g npm@12.0.2

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]