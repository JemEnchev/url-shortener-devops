FROM node:20-alpine


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 8080

USER node

CMD ["node", "src/server.js"]
