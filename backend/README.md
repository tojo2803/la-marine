# La Marine — Backend

API backend du site du restaurant **La Marine** (réservations, créneaux, back-office administrateur).

Cette API a été construite pour correspondre exactement aux choix techniques décrits dans le Dossier Professionnel : Node.js/Express, ORM Sequelize (pas de SQL brut sauf cas particulier), PostgreSQL, pattern Repository, gestion des conflits de réservation en `409`, authentification JWT pour le back-office.

## Stack technique

- Node.js / Express
- Sequelize (ORM) + PostgreSQL
- JWT (jsonwebtoken) + bcrypt pour l'authentification admin
- `sequelize-cli` pour les migrations et seeders

## Architecture du code

```
src/
├── app.js                # Configuration Express (middlewares, routes, gestion d'erreurs)
├── server.js             # Point d'entrée : connexion DB + démarrage du serveur
├── config/
│   ├── config.js         # Config utilisée par sequelize-cli (migrations/seeders)
│   └── database.js       # Instance Sequelize utilisée par l'application
├── models/                # Définition des tables (Sequelize)
├── migrations/            # Historique versionné du schéma de base de données
├── seeders/                # Données de démarrage (créneaux, paramètres restaurant)
├── repositories/          # Seule couche qui parle à Sequelize (jamais les routes)
├── services/               # Logique métier (règles de réservation, auth)
├── controllers/            # Reçoivent la requête HTTP, appellent le service, répondent
├── routes/                  # Déclaration des endpoints
├── middlewares/             # Validation des entrées, authentification JWT, gestion d'erreurs
└── scripts/createAdmin.js   # Utilitaire pour créer un compte admin
```

## Installation

```bash
npm install
cp .env.example .env
# Remplis .env avec tes propres valeurs (base de données, secret JWT...)
```

## Base de données

### Option A — avec Docker (recommandé, pas d'installation de PostgreSQL nécessaire)

Un fichier `docker-compose.yml` est fourni à la racine du projet. Il lance PostgreSQL (et Adminer, une interface web pour consulter la base) en conteneurs, sans rien installer sur ta machine.

Prérequis : avoir [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé.

```bash
# Toujours dans le dossier backend/, après avoir rempli ton .env (voir plus haut)
docker compose up -d
```

Cela crée automatiquement une base PostgreSQL avec le nom d'utilisateur, mot de passe et nom de base définis dans ton `.env` (variables `DB_NAME`, `DB_USER`, `DB_PASSWORD`) — inutile d'exécuter les commandes `CREATE DATABASE` manuellement, Docker s'en charge.

Tu peux vérifier que ça tourne avec :
```bash
docker compose ps
```

Pour consulter la base dans un navigateur : ouvre `http://localhost:8080` (Adminer), système = PostgreSQL, serveur = `postgres`, et les identifiants de ton `.env`.

Pour arrêter : `docker compose down` (les données restent conservées grâce au volume). Pour tout effacer et repartir de zéro : `docker compose down -v`.

Une fois le conteneur lancé, passe directement à la section **Lancer les migrations** ci-dessous — inutile de faire l'Option B.

### Option B — PostgreSQL installé directement sur ta machine

1. Crée la base PostgreSQL et un utilisateur applicatif dédié :

```sql
CREATE DATABASE la_marine;
CREATE USER la_marine_app WITH PASSWORD 'change-me';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO la_marine_app;
-- Volontairement pas de droits DROP / ALTER / CREATE pour cet utilisateur applicatif
-- (voir DP, compétence "Développer des composants d'accès aux données").
```

### Lancer les migrations et les données de départ (Option A ou B)

```bash
npm run db:migrate
npm run db:seed
```

3. Crée ton premier compte administrateur pour accéder au back-office :

```bash
node src/scripts/createAdmin.js admin@lamarine.fr un-mot-de-passe-solide "Ton Nom"
```

## Lancer le serveur

```bash
npm run dev     # avec rechargement automatique (nodemon)
# ou
npm start
```

Le serveur écoute par défaut sur `http://localhost:3000`.

## Endpoints principaux

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/health` | public | Vérifie que l'API répond |
| POST | `/api/reservations` | public | Créer une réservation (formulaire du site) |
| GET | `/api/reservations` | admin (JWT) | Lister les réservations (filtres `?date=&status=`) |
| PATCH | `/api/reservations/:id/status` | admin (JWT) | Confirmer / annuler une réservation |
| GET | `/api/time-slots` | public | Liste des créneaux disponibles |
| PATCH | `/api/time-slots/:id/capacity` | admin (JWT) | Modifier la capacité d'un créneau |
| PATCH | `/api/time-slots/:id/active` | admin (JWT) | Ouvrir/fermer un créneau |
| GET | `/api/closing-days` | public | Liste des jours de fermeture exceptionnels |
| POST | `/api/closing-days` | admin (JWT) | Ajouter un jour de fermeture |
| DELETE | `/api/closing-days/:id` | admin (JWT) | Supprimer un jour de fermeture |
| POST | `/api/auth/login` | public | Connexion admin — renvoie un token JWT |

Pour les routes protégées, envoyer le header :
`Authorization: Bearer <token reçu au login>`

## Exemple d'appel — créer une réservation

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Dupont",
    "email": "marie@exemple.fr",
    "phone": "0612345678",
    "date": "2026-09-15",
    "service": "dinner",
    "time": "19h30",
    "guests": 4,
    "message": "Anniversaire"
  }'
```

Réponses possibles :
- `201 Created` : réservation enregistrée (statut `pending`)
- `400 Bad Request` : données invalides, date passée, jour de fermeture
- `409 Conflict` : créneau complet pour cette date

## Jeu de données de test et vérification automatique

### Peupler la base avec des données de démonstration

```bash
npm run db:seed
```

Ce seeder ajoute automatiquement 6 réservations réalistes (statuts variés : en attente, confirmées, annulée) réparties sur plusieurs jours et créneaux, pour avoir un dashboard qui ressemble à une vraie activité dès le départ.

### Vérifier automatiquement que toutes les règles métier fonctionnent

Un script teste, dans l'ordre, l'ensemble des comportements attendus du backend en appelant directement l'API (le serveur doit déjà tourner avec `npm run dev`) :

```bash
node src/scripts/testScenarios.js admin@lamarine.fr ton-mot-de-passe
```

Il vérifie notamment :
- ✅ Création d'une réservation valide (`201`)
- ✅ Rejet d'un email invalide, d'un nombre de personnes à 0 (`400`)
- ✅ Rejet d'une date déjà passée (`400`)
- ✅ Rejet d'une réservation un lundi (jour de fermeture hebdomadaire seedé) (`400`)
- ✅ Conflit `409` quand un créneau dépasse sa capacité (20 couverts)
- ✅ Login admin (`200`) et rejet d'un mauvais mot de passe (`401`)
- ✅ Routes back-office refusées sans token (`401`), acceptées avec (`200`)
- ✅ Confirmation d'une réservation (`200`) et 404 sur une réservation inexistante
- ✅ Ajout d'un jour de fermeture exceptionnel, et rejet d'une réservation ce jour-là
- ✅ Consultation publique des créneaux disponibles

Chaque ligne affiche ✅ ou ❌ avec le code HTTP attendu vs reçu, et un résumé final (`X réussi(s), Y échoué(s)`). Pratique à relancer après chaque modification du code, ou à montrer tel quel à l'oral pour prouver que les règles métier du DP sont bien implémentées.

## Tests unitaires (Jest)

Contrairement au script `testScenarios.js` (qui teste l'API en conditions réelles, via HTTP, avec la vraie base de données — un test **système/fonctionnel**), les tests unitaires ci-dessous isolent chaque fonction avec des **mocks** : aucune base de données ni serveur nécessaire, exécution en une seconde.

```bash
npm test             # lance tous les tests une fois
npm run test:watch   # relance automatiquement à chaque modification
```

Fichiers de tests :
- `src/services/__tests__/reservation.service.test.js` — règles métier (date passée, jour fermé, capacité dépassée/atteinte, statuts)
- `src/services/__tests__/auth.service.test.js` — login (bons/mauvais identifiants, token, aucune fuite du hash de mot de passe)
- `src/middlewares/__tests__/validate.test.js` — validation des entrées du formulaire de réservation

25 tests au total, tous passants.

## Ce qui n'est volontairement pas encore géré (pistes de progression du DP)


- La gestion de la concurrence sur les réservations simultanées est réduite (transaction + verrouillage), mais pas totalement éliminée sous forte charge.
- Pas de pipeline CI/CD automatisé pour l'instant (tests + déploiement manuels).
- Migration possible vers Prisma évoquée comme piste, non réalisée sur ce projet.

## Connecter le front-end Vue.js

Dans `ReservationPage.vue`, remplace la fonction `submitReservation` par un appel à l'API, par exemple :

```js
async function submitReservation() {
  try {
    const response = await fetch("http://localhost:3000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        service: reservation.service,
        time: reservation.time,
        guests: Number(reservation.guests),
        message: reservation.message,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    window.alert(result.message);
  } catch (err) {
    window.alert(err.message || "Une erreur est survenue.");
  }
}
```

N'oublie pas de renseigner `CLIENT_ORIGIN` dans `.env` avec l'URL de ton front-end (ex: `http://localhost:5173` pour Vite en dev) pour que le CORS autorise les appels.
