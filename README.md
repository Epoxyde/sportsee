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

## Données et calculs

Par défaut, les données affichées proviennent de l'API, pour le compte connecté. Pour changer de source sans modifier les composants ni les hooks, copier `.env.example` vers `.env` à la racine du frontend :

```bash
cp .env.example .env
```

Dans `.env`, choisir `VITE_DATA_SOURCE=mock` pour les données locales ou `VITE_DATA_SOURCE=api` pour l'API, puis redémarrer le serveur frontend. En déploiement, reconstruire l'application après ce changement. Sans configuration, le mode API est utilisé. `.env` est ignoré par Git ; `.env.example` est versionné.

Le choix est centralisé dans `app/services/userService.ts`. Les deux sources renvoient le même format : profil normalisé, activités triées, bornes de période incluses et séances futures exclues. Une erreur API n'entraîne jamais de bascule automatique vers les mocks.

**Le mode mock concerne uniquement le profil et les activités.** La connexion et la photo restent dépendantes du backend. Utiliser le compte de démonstration Sophie : les mocks représentent toujours Sophie, quel que soit le compte connecté. Leur historique est partiel et leurs totaux sont des valeurs de démonstration ; les calories et jours de repos calculés ne constituent donc pas un bilan réel depuis l'inscription.

| Requête | Utilisation |
| --- | --- |
| `POST /api/login` | Connexion avec identifiant et mot de passe |
| `GET /api/user-info` | Profil et statistiques globales |
| `GET /api/user-activity?startWeek=YYYY-MM-DD&endWeek=YYYY-MM-DD` | Séances d'une période, bornes incluses |

### Kilomètres

À l'ouverture, le graphique couvre la semaine actuelle et les trois précédentes, du lundi au dimanche. Chaque barre représente le total d'une semaine. La moyenne est la somme des kilomètres de la période divisée par quatre, y compris les semaines sans activité. La semaine actuelle peut être incomplète. Les flèches déplacent la période de quatre semaines.

### Fréquence cardiaque

Le graphique s'ouvre sur la semaine actuelle. Les flèches déplacent la période d'une semaine.

Lorsqu'une journée contient plusieurs séances, le minimum est le plus petit des minima, le maximum est le plus grand des maxima, et la moyenne est pondérée par la durée des séances. Le titre affiche aussi une moyenne pondérée, sur toute la semaine. Le calcul utilise le champ `heartRate.average` de l'API : ce n'est pas la moyenne arithmétique du minimum et du maximum.

Un jour sans séance reste sans mesure (`null`) : la courbe s'interrompt et aucune valeur de 0 BPM n'est inventée.

### Bilan « Cette semaine » et objectif

Le bilan concerne la semaine actuelle, du lundi au dimanche, selon la date locale du navigateur. Il compte les séances, pas les jours actifs : deux courses le même jour comptent pour deux séances. Les durées et les distances sont additionnées.

**L'objectif hebdomadaire est fixé à 6 courses d'après la maquette. Il ne représente pas un objectif personnel récupéré depuis l'API.** Le fichier de données du backend contient des champs d'objectif à des emplacements différents selon les comptes, mais l'endpoint `/api/user-info` ne les expose pas.

Le nombre de courses restantes et l'anneau de progression reposent donc sur cette hypothèse. Au-delà de six séances, l'anneau reste à 100 %, tandis que le compteur affiche le nombre réel de courses. Cette limite devra être revue si l'API fournit un objectif utilisateur.

### Statistiques complémentaires du profil

La page Profil conserve les totaux renvoyés par `/api/user-info` (durée, distance et nombre de sessions). Le genre n'est pas fourni par cette réponse : il reste affiché comme « Indisponible ».

Les calories et les jours de repos sont calculés à partir de `/api/user-activity`, depuis la date d'inscription jusqu'à la date locale du jour, bornes incluses :

- Calories : somme des champs `caloriesBurned` des séances.
- Jours de repos : nombre de jours calendaires de la période moins le nombre de dates distinctes avec au moins une course. Deux séances le même jour comptent pour un seul jour actif.

Un jour sans course enregistrée est considéré comme un jour de repos, y compris aujourd'hui tant qu'aucune séance n'est enregistrée. Ce calcul suppose un historique complet. Le backend local utilise les données d’origine fournies avec le projet ; seules les séances comprises entre l’inscription et aujourd’hui sont prises en compte pour ces deux calculs.

Ces deux calculs excluent les séances futures. Les trois totaux globaux restent ceux du backend et peuvent, eux, inclure des séances futures (voir ci-dessous). En cas d'échec du chargement des activités, les deux cartes affichent « Indisponible », et non des zéros trompeurs.

### Données du backend local

Les données de l’API proviennent du fichier `backend/app/data.json` fourni avec le backend.

Ce fichier est extérieur au dépôt frontend. Les mocks du frontend restent disponibles via `VITE_DATA_SOURCE=mock` pour tester des semaines plus actives sans modifier le backend.

Les données sont fixes : le backend ne génère pas de nouvelles séances à chaque requête. L’endpoint d’activité exclut les dates futures, même si elles sont déjà présentes dans le fichier. En revanche, les statistiques globales de `/api/user-info` additionnent toutes les séances du fichier, y compris les futures : c’est le comportement actuel du backend fourni.

Après une modification des données, redémarrer le backend si nécessaire pour charger le fichier mis à jour.

## Vérifications et build

Depuis le dossier frontend :

```bash
npm run typecheck
npm run build
```

La vérification TypeScript et le build ne remplacent pas les essais dans le navigateur : connexion, déconnexion, accès aux routes protégées, changement de période, données absentes et indisponibilité du backend.

Le build SPA est produit dans `build/client`. L'hébergement doit rediriger les routes de l'application vers `index.html` pour permettre l'accès direct à `/dashboard` ou `/profile`. Le script `npm start` du template vise un serveur React Router et n'est pas la procédure de déploiement de cette SPA.
