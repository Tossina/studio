# DagoPoker - Plateforme de Poker en Ligne

Application de poker en ligne temps réel développée avec Next.js, Socket.io et SQLite.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation

1. **Cloner le projet et installer les dépendances**

```bash
cd studio
npm install
```

2. **Configurer la base de données**

Le fichier `.env` contient déjà la configuration SQLite :
```env
DATABASE_URL="file:./dev.db"
```

Initialisez la base de données avec Prisma :
```bash
npm run db:push
```

3. **Lancer l'application**

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

## 📦 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de développement avec hot-reload |
| `npm run build` | Compile l'application pour la production |
| `npm start` | Lance le serveur en mode production |
| `npm run db:push` | Synchronise le schéma Prisma avec la base de données |
| `npm run db:studio` | Ouvre Prisma Studio pour gérer la base de données visuellement |
| `npm run lint` | Exécute le linter ESLint |
| `npm run typecheck` | Vérifie les types TypeScript |

## 🏗️ Architecture Technique

### Stack Technologique

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Node.js, Express 5
- **Base de données**: SQLite (dev) → PostgreSQL (production)
- **ORM**: Prisma 6
- **Temps réel**: Socket.io 4
- **Authentification**: JWT (local)
- **Validation**: Zod, React Hook Form

### Structure du Projet

```
studio/
├── prisma/
│   └── schema.prisma          # Schéma de la base de données
├── src/
│   ├── app/                   # Pages Next.js (App Router)
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Endpoints d'authentification
│   │   │   └── games/        # Endpoints de gestion des tables
│   │   ├── lobby/            # Page lobby
│   │   ├── play/[tableId]/   # Page de jeu
│   │   ├── profile/          # Page profil utilisateur
│   │   ├── cashier/          # Page de gestion des fonds
│   │   └── layout.tsx        # Layout principal
│   ├── components/           # Composants React réutilisables
│   │   ├── ui/              # Composants UI de base (Radix)
│   │   ├── header.tsx       # En-tête de l'application
│   │   ├── poker-table.tsx  # Table de poker
│   │   └── ...
│   ├── lib/                  # Utilitaires et services
│   │   ├── auth-service.ts  # Service d'authentification
│   │   ├── game-manager.ts  # Gestionnaire de jeu côté serveur
│   │   ├── db.ts           # Client Prisma
│   │   ├── socket.ts       # Client Socket.io
│   │   └── types.ts        # Types TypeScript
│   ├── hooks/               # Hooks React personnalisés
│   │   └── use-socket-game.ts
│   └── providers/           # Providers React Context
│       └── auth-provider.tsx
├── server.ts                # Serveur Express + Socket.io
├── .env                     # Variables d'environnement
└── package.json

```

## 🎮 Fonctionnalités

### ✅ Implémentées

- **Authentification locale** (inscription/connexion avec JWT)
- **Gestion des utilisateurs** (profil, solde)
- **Lobby** 
  - Liste des tables disponibles
  - Filtres (variante, format, stakes)
  - Création de nouvelles tables
- **Table de poker** (interface visuelle)
- **Communication temps réel** (Socket.io)
- **Gestion des fonds** (interface Cashier)

### 🚧 En Développement

- Logique de jeu poker complète (distribution, tours d'enchères, showdown)
- Système de transactions financières
- Chat en temps réel
- Historique des mains
- Statistiques joueur

## 🗄️ Modèle de Données

### User
- `id`, `email`, `passwordHash`, `username`
- `avatarUrl`, `balance`, `playMoney`
- `createdAt`, `updatedAt`

### Game
- `id`, `name`, `variant`, `format`, `status`
- `maxPlayers`, `smallBlind`, `bigBlind`
- `pot`, `communityCards`, `dealerPosition`

### Player
- `id`, `userId`, `gameId`, `position`
- `stack`, `cards`, `status`, `currentBet`
- `isDealer`, `isTurn`

### Transaction
- `id`, `userId`, `amount`, `type`, `status`

## 🔐 Authentification

L'application utilise un système d'authentification JWT local :

- **Inscription** : `POST /api/auth/register`
- **Connexion** : `POST /api/auth/login`
- **Session** : `GET /api/auth/me`
- **Déconnexion** : `POST /api/auth/logout`

Les tokens JWT sont stockés dans des cookies HTTP-only pour plus de sécurité.

## 🌐 API Endpoints

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Info utilisateur |
| POST | `/api/auth/logout` | Déconnexion |

### Tables de jeu

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/games` | Liste des tables |
| POST | `/api/games` | Créer une table |

## 🔌 Événements Socket.io

### Client → Serveur

- `join-game` - Rejoindre une table
- `player-action` - Action du joueur (fold, call, raise, etc.)

### Serveur → Client

- `game-state` - État complet de la partie
- `error` - Erreur

## 🛠️ Configuration

### Variables d'Environnement (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="votre-secret-jwt-super-securise"
NODE_ENV="development"
```

### Base de données

Pour réinitialiser la base de données :
```bash
# Supprimer la base
rm dev.db

# Recréer le schéma
npm run db:push
```

Pour explorer la base avec Prisma Studio :
```bash
npm run db:studio
```

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# Vérifier que les dépendances sont installées
npm install

# Vérifier TypeScript
npm run typecheck
```

### Erreur de base de données

```bash
# Régénérer le client Prisma
npx prisma generate

# Pousser le schéma
npm run db:push
```

### Port 3000 déjà utilisé

Modifier le port dans `server.ts` :
```typescript
const port = 3001; // Ou un autre port libre
```

## 📝 Notes de Migration

Ce projet a été migré de Firebase vers une architecture locale :

- **Firebase Auth** → **JWT local**
- **Firestore** → **Prisma + SQLite**
- **Firebase Hosting** → **Custom Express Server**

## 🤝 Contribution

Cette application est en développement actif. Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.

## 📄 Licence

Projet privé - Tous droits réservés

---

**Développé avec ❤️ pour DagoPoker**
