
FROM node:20-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install --omit=optional


COPY . .

ENV NODE_ENV=production
EXPOSE 3000


ENTRYPOINT ["sh", "docker-entrypoint.sh"]
