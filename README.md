# La Marine — Déploiement local conteneurisé (Docker)

Ce dossier permet de lancer **l'intégralité du projet** (base de données PostgreSQL, backend Node.js/Express, frontend Vue.js) avec une seule commande, chaque brique tournant dans son propre conteneur — exactement comme en production, mais en local sur ta machine.

C'est un choix assumé : plutôt que de déployer sur un hébergeur externe (Render, Railway...) dont la configuration spécifique n'aurait pas été pleinement maîtrisée, ce déploiement conteneurisé démontre les mêmes compétences (isolation des services, configuration par variables d'environnement, reproductibilité) sans dépendre d'un tiers.

> **Remarque** : le dossier `backend/` contient aussi son propre `docker-compose.yml`, plus simple (PostgreSQL seul), utile si tu veux développer le backend en local avec `npm run dev` sans reconstruire d'image à chaque changement. Le `docker-compose.yml` **à la racine** (celui de ce README) est celui à utiliser pour le déploiement complet du projet.

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
# Ouvre .env et personnalise les valeurs si tu veux (sinon les valeurs par défaut suffisent pour tester)

docker compose up -d --build
```

La première fois, Docker construit les images (peut prendre 1 à 2 minutes : téléchargement de Node/nginx/Postgres, `npm install`, build Vite).

## Vérifier que tout tourne

```bash
docker compose ps
```

Tu dois voir 4 conteneurs : `la-marine-postgres`, `la-marine-backend`, `la-marine-frontend`, `la-marine-adminer`, tous avec le statut `running` (ou `healthy` pour postgres).

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

## Ce que ce déploiement démontre concrètement

- **Isolation des services** : base de données, backend et frontend ne partagent rien directement, ils communiquent uniquement via le réseau Docker ou des ports exposés
- **Configuration externalisée** : aucune valeur sensible ou spécifique à un environnement n'est codée en dur (tout passe par des variables d'environnement, un seul fichier `.env` à la racine)
- **Reproductibilité** : n'importe qui avec Docker installé peut reconstruire exactement le même environnement avec `docker compose up -d --build`
- **Migrations automatisées et rejouables** : le script `docker-entrypoint.sh` applique les migrations à chaque démarrage du backend, sans risque de casser quoi que ce soit si elles ont déjà été appliquées

## Limite assumée

Ce déploiement reste **local** : il ne remplace pas une mise en production réelle sur un hébergeur accessible depuis Internet. Le choix de l'hébergeur final n'a pas encore été arbitré avec la direction d'A2SD — ce déploiement conteneurisé constitue néanmoins une préparation concrète et directement transposable le jour où ce choix sera fait (les mêmes images Docker pourraient être déployées telles quelles sur la plupart des hébergeurs compatibles conteneurs).
