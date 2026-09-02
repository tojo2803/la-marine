# Étape 1 : construire les fichiers statiques du site Vue.js avec Vite
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# L'URL de l'API est injectée AU MOMENT DU BUILD (Vite intègre les variables
# VITE_* directement dans le code compilé, il n'y a pas de "vraie" variable
# d'environnement lue au démarrage comme côté backend).
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Étape 2 : servir les fichiers statiques générés avec nginx (image finale légère)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
