# SajiloSite

AI website builder that generates modern, responsive sites from natural language prompts using OpenRouter's Deepseek model. Includes Google authentication, a live editor with Monaco + AI chat updates, one-click deployment, and public site viewing.

---

## Tech Stack

**Frontend** — React 19, Vite 8, Tailwind CSS v4, Motion (framer-motion), Redux Toolkit, Monaco Editor, Lucide React, Axios, React Router v7, Firebase Auth

**Backend** — Node.js, Express 5, Mongoose 9, JWT (httpOnly cookies), CORS, OpenRouter (deepseek/deepseek-chat), serverless-http (Vercel)

---

## Features

- Google sign-in via Firebase Auth popup/redirect with backend JWT session cookie
- Protected routes for Dashboard, Generate, and Editor pages
- AI website generation from natural language prompts (with animated progress states)
- Example prompts on the Generate page for quick inspiration
- Live editor with Monaco code editor, auto-save draft, and AI-powered chat updates (with pause/cancel/resume)
- Conversation history per website (user/AI messages)
- One-click deployment with unique slug URLs
- Dashboard with grid/list views, search, sort (updated, created, title), stats, deploy, copy link, and delete
- Public live site viewing at `/site/:slug`
- Raw HTML preview endpoints (iframe-ready with localStorage/sessionStorage shim)
- Vercel deployment support (client SPA + serverless handler)

---

## Project Structure

```
client/          # React app (Vite)
  src/
    components/  # LoginModal
    hooks/       # useGetCurrentUser
    pages/       # Home, Dashboard, Generate, Editor, LiveSite
    redux/       # store, userSlice
    utils/       # srcdoc (iframe sandbox shims)
    config.js    # server URL
    firebase.js  # Firebase client init
server/          # Express API
  api/           # Vercel serverless handler
  config/        # db, firebase, openRouter
  controllers/   # auth, user, website
  middlewares/    # isAuth (JWT)
  models/        # user, website
  routes/        # auth, user, website
  scripts/       # utility scripts
  utils/         # extractJson
```

---

## Requirements

- Node.js 18+
- MongoDB connection string (Atlas or local)
- Firebase project (Web app) for Google authentication
- OpenRouter API key

---

## Environment Variables

### server/.env

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
LIVE_SITE_URL=http://localhost:5173
```

### client/.env

```
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

> Firebase project config is partially hardcoded in `client/src/firebase.js` and `server/config/firebase.js`.

---

## Setup

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Run Locally (two terminals)

```bash
# Terminal 1 — API
cd server
npm run dev        # starts on http://localhost:5000

# Terminal 2 — Client
cd client
npm run dev        # starts on http://localhost:5173
```

---

## Scripts

| Directory | Script | Description |
|-----------|--------|-------------|
| client | `npm run dev` | Start Vite dev server |
| client | `npm run build` | Production build |
| client | `npm run preview` | Preview production build |
| client | `npm run lint` | ESLint |
| server | `npm run dev` | Start Express with nodemon |

---

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/google` | Google login / signup |
| GET | `/api/auth/logout` | Clear auth cookie |

### User
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/me` | Get current user (requires auth) |

### Website (most require auth)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/website/generate` | Generate website from prompt |
| POST | `/api/website/update/:id` | Update website via AI chat |
| GET | `/api/website/get-by-id/:id` | Get single website |
| GET | `/api/website/get-all` | Get all user websites |
| GET | `/api/website/deploy/:id` | Deploy (generates slug URL) |
| GET | `/api/website/get-by-slug/:slug` | Get deployed site by slug (public) |
| GET | `/api/website/preview/:slug` | Preview raw HTML by slug (public) |
| GET | `/api/website/preview-by-id/:id` | Preview raw HTML by ID |
| POST | `/api/website/save-draft/:id` | Save code draft |
| DELETE | `/api/website/:id` | Delete website |

---

## AI Model

Uses OpenRouter with `deepseek/deepseek-chat`. Configuration is in `server/config/openRouter.js`. The system prompt enforces raw JSON output with full HTML documents that render inside sandboxed iframes.

---

## Deployment

Both client and server include Vercel configuration:

- **Client** — `client/vercel.json` (SPA rewrites to `index.html`)
- **Server** — `server/vercel.json` + `server/api/index.js` (serverless handler with connection caching)
