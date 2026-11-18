# SportSee

Projet 6 de la formation OpenClassrooms : développer un dashboard de sport avec React et React Router.

L'application permet de se connecter, de consulter son profil et de suivre ses distances parcourues, sa fréquence cardiaque et son activité hebdomadaire. Les pages de connexion, de tableau de bord et de profil sont intégrées d'après la maquette fournie.

## Technologies

React, TypeScript, React Router en mode Framework SPA (`ssr: false`), Axios, Context API, Recharts, Tailwind CSS et CSS.

## Installation et démarrage

Environnement testé : Node.js 22.23.2 et npm. Utiliser Node.js 22.12 ou supérieur dans la branche 22.

Le backend est un projet distinct, nécessaire pour se connecter et afficher les données. Seul le frontend est versionné dans ce dépôt.

Organisation locale :

```text
P6 - Sportsee/
├── backend/
└── frontend/      # Ce dépôt
```

Dans un premier terminal, depuis le dossier `backend` :

```bash
npm ci
npm run dev
```

L'API est accessible sur `http://localhost:8000/api`. La racine `http://localhost:8000/` n'a pas de page : le message « Cannot GET / » est normal.

Dans un second terminal, depuis le dossier `frontend` :

```bash
npm ci
npm run dev
```

Ouvrir l'adresse indiquée par Vite, habituellement `http://localhost:5173`.

Compte de démonstration fourni avec le backend pédagogique :

```text
Identifiant : sophiemartin
Mot de passe : password123
```

L'adresse de l'API est définie dans `app/services/api.ts`.

## Routes et authentification

- `/login` : formulaire de connexion.
- `/dashboard` : graphiques et bilan d'activité, accessibles après connexion.
- `/profile` : informations personnelles et statistiques, accessibles après connexion.
- Les URL inconnues affichent une page 404.

Le backend renvoie un JWT lors de la connexion. `AuthContext` conserve la session dans `sessionStorage` et transmet le token dans l'en-tête `Authorization: Bearer …` des requêtes Axios. La déconnexion et l'expiration du token effacent la session. La vérification de la signature du JWT reste à la charge du backend.

Si l'API refuse le token de la session courante avec une réponse 401 ou 403, la session locale est effacée et les routes protégées redirigent vers la connexion. Une erreur d'identifiants sur `/login`, une panne réseau ou une erreur serveur ne déclenche pas cette déconnexion. Une réponse tardive liée à un ancien token ne déconnecte pas une nouvelle session.

Le formulaire affiche « Identifiant » plutôt que « Adresse email » (libellé de la maquette), car le backend attend un `username`. La réinitialisation du mot de passe n'est pas disponible : la mention « Mot de passe oublié ? » reste un simple texte sans action. Les mentions « Conditions générales » et « Contact » du pied de page n'ont pas de destination définie et restent du texte.

## Organisation du code

| Dossier ou fichier | Rôle |
| --- | --- |
| `app/routes.ts` | Déclaration des routes |
| `app/routes/` | Pages et protection des routes |
| `app/components/` | Graphiques, navigation entre périodes et bilan hebdomadaire |
| `app/contexts/` | Partage de la session d'authentification |
| `app/hooks/` | Chargement des données, états de chargement et d'erreur |
| `app/services/` | Appels Axios et normalisation des réponses |
| `app/utils/` | Calcul des périodes et préparation des données des graphiques |
| `app/mocks/` | Données de développement utilisées en mode mock |

Les composants utilisent les hooks, qui appellent les services. Les requêtes HTTP sont réalisées en dehors des composants. La distance totale du profil, reçue sous forme de chaîne, est convertie en nombre avant utilisation.

## Choisir la source des données

Par défaut, les données affichées proviennent de l'API, pour le compte connecté. Pour changer de source sans modifier les composants ni les hooks, copier `.env.example` vers `.env` à la racine du frontend :

```bash
cp .env.example .env
```

Dans `.env`, choisir `VITE_DATA_SOURCE=mock` pour les données locales ou `VITE_DATA_SOURCE=api` pour l'API, puis redémarrer le serveur frontend. En déploiement, reconstruire l'application après ce changement. Sans configuration, le mode API est utilisé. `.env` est ignoré par Git ; `.env.example` est versionné.
