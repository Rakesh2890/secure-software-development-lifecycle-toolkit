FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force
RUN rm -rf /usr/local/lib/node_modules/npm

COPY --chown=node:node server.js ./
COPY --chown=node:node public ./public

USER node

EXPOSE 3001

CMD ["node", "server.js"]