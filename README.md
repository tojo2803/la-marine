# La Marine — Déploiement local conteneurisé (Docker)

Ce dossier permet de lancer **l'intégralité du projet** (base de données PostgreSQL, backend Node.js/Express, frontend Vue.js) avec une seule commande, chaque brique tournant dans son propre conteneur — exactement comme en production, mais en local sur ta machine.

C'est un choix assumé : plutôt que de déployer sur un hébergeur externe (Render, Railway...) dont la configuration spécifique n'aurait pas été pleinement maîtrisée, ce déploiement conteneurisé démontre les mêmes compétences (isolation des services, configuration par variables d'environnement, reproductibilité) sans dépendre d'un tiers.


## Structure

```
.
├── docker-compose.yml     # Orchestre les 3 services
├── .env.example           # Config partagée par tous les services
├── backend/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh   # Applique les migrations puis démarre le serveur
│   └── ... (code du backend)
└── frontend/
    ├── Dockerfile              # Build multi-étapes : Vite build -> nginx
    ├── nginx.conf              # Sert les fichiers statiques + gère les routes Vue Router
    └── ... (code du frontend)
```

## Démarrage

```bash
cp .env.example .env


docker compose up -d --build
```

La première fois, Docker construit les images (peut prendre 1 à 2 minutes : téléchargement de Node/nginx/Postgres, `npm install`, build Vite).

## Vérifier que tout tourne

```bash
docker compose ps
```

Les 4 conteneurs : `la-marine-postgres`, `la-marine-backend`, `la-marine-frontend`, `la-marine-adminer`, tous avec le statut `running` (ou `healthy` pour postgres).

Le backend applique **automatiquement** les migrations au démarrage (voir `docker-entrypoint.sh`) — inutile de le faire à la main comme en développement local.

## Charger les données de départ (une seule fois)

```bash
docker compose exec backend npm run db:seed
```

## Créer un compte administrateur

```bash
docker compose exec backend node src/scripts/createAdmin.js admin@lamarine.fr mot-de-passe " Nom"
```

## Accéder au site

| Service | URL |
|---|---|
| **Site (frontend)** | http://localhost:8081 |
| API backend | http://localhost:3000/api/health |
| Adminer (visualiser la base) | http://localhost:8080 |

Pour Adminer : système = PostgreSQL, serveur = `postgres`, utilisateur/mot de passe/base = ceux de ton `.env`.

## Lancer les tests dans le conteneur

```bash
docker compose exec backend npm test
```

## Voir les logs d'un service

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Arrêter / tout réinitialiser

```bash
docker compose down       # arrête les conteneurs, garde les données
docker compose down -v    # arrête ET supprime les données (repart de zéro)
```
