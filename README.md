# SajiloSite

SajiloSite is an AI website builder that generates modern, responsive sites using OpenRouter's Deepseek model. It includes Google authentication, user sessions, a full generation flow, and a live editor with AI-powered chat updates.

## Tech stack

Frontend
- React (Vite)
- Tailwind CSS
- Motion (`motion`)
- Redux Toolkit
- Firebase Auth

Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT cookies
- OpenRouter (Deepseek model: `deepseek/deepseek-chat`)

## Features

- Google sign-in (Firebase Auth) with backend session cookie
- Protected routes for dashboard and generation pages
- User session lookup via `GET /api/user/me`
- Modern UI with Motion animations and Tailwind styling
- AI website generation from natural language prompts
- Live editor with AI-powered chat updates and Monaco code editor
- One-click deployment with unique slug URLs
- Dashboard with grid/list views, search, sort, and deploy controls

## Repository structure

```
client/   # React app (Vite)
server/   # Express API
```

## Requirements

- Node.js 18+ recommended
- MongoDB connection string (Atlas or local)
- Firebase project (Web app) for Google auth
- OpenRouter API key

## Environment variables

Create `.env` files in both `client` and `server`.

### server/.env

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### client/.env

```
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

Note: Firebase project details are currently hardcoded in [client/src/firebase.js](client/src/firebase.js).

## Setup

### 1) Install dependencies

```
# API
cd server
npm install

# Web
cd ../client
npm install
```

### 2) Run locally (two terminals)

```
# API
cd server
npm run dev
```

```
# Web
cd client
npm run dev
```

The client defaults to `http://localhost:5173`. The API defaults to `http://localhost:5000`.

## Scripts

Client (Vite) in [client/package.json](client/package.json)
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - ESLint

Server (Express) in [server/package.json](server/package.json)
- `npm run dev` - start API with nodemon

## API routes

### Auth
- `POST /api/auth/google` - Google login / signup
- `GET /api/auth/logout` - Clear auth cookie

### User
- `GET /api/user/me` - Get current user (requires auth)

### Website generation (all require auth)
- `POST /api/website/generate` - Generate a website from a prompt
- `POST /api/website/update/:id` - Update website via AI chat
- `GET /api/website/get-by-id/:id` - Get a single website
- `GET /api/website/get-all` - Get all user websites
- `GET /api/website/deploy/:id` - Deploy website (generates slug URL)
- `GET /api/website/get-by-slug/:slug` - Get a deployed website by slug (public)
- `DELETE /api/website/:id` - Delete a website

## OpenRouter model

The backend uses OpenRouter with the Deepseek model:

```
const model = "deepseek/deepseek-chat";
```

See [server/config/openRouter.js](server/config/openRouter.js) for request configuration.

## Project status

Complete. The full AI website generation flow — prompt-based generation, iterative chat updates, Monaco code editing, one-click deployment, and public site viewing — is implemented and functional.
