#!/bin/sh
set -e

echo "Application des migrations en attente..."
npx sequelize-cli db:migrate

echo "Démarrage du serveur..."
exec node src/server.js
