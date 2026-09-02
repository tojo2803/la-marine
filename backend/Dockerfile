# Image du backend La Marine (Node.js/Express + Sequelize)
FROM node:20-alpine

WORKDIR /app

# Copie uniquement les fichiers de dépendances d'abord (meilleur cache Docker :
# si le code change mais pas package.json, npm install n'est pas refait).
COPY package*.json ./
RUN npm install --omit=optional

# Copie le reste du code source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Au démarrage : on applique les migrations en attente (idempotent, sans danger
# de les rejouer), PUIS on démarre le serveur. Voir docker-entrypoint.sh.
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
