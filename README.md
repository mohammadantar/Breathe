# Breathe

**Breathe** is a single-page web app for mental health support: guided breathing and panic help, journaling, and an AI companion (“Bree”) powered by Google Gemini. It supports English and Arabic, optional Firebase (Auth / Firestore), and falls back to local mock storage when Firebase is not configured.

## Project structure

This repo is intentionally **flat**: there is no `src/` tree. Almost all user-facing behavior lives in one HTML file; Vite still bundles and serves it like a normal SPA.

```
Breathe/
├── index.html          # Main app: HTML shell, global styles, React UI (Babel), Firebase + mock Firestore, Gemini client
├── en.json             # English i18n strings (i18next)
├── ar.json             # Arabic i18n strings
├── vite.config.js      # Dev server (port 5173), env loading, Gemini key define
├── package.json        # Dependencies and npm scripts
├── server.js           # Optional Express app: serves dist/ + /api/chat and /api/analyze
├── Dockerfile          # Image: install deps → `npm run build` → `node server.js`
├── cloudbuild.yaml     # Google Cloud Build: Docker image to Artifact Registry
├── .dockerignore       # Files excluded from Docker build context
├── .gitignore          # Ignores node_modules, dist, .env, etc.
├── db.js               # Tiny in-repo data stub (sample “memories”; used by some scripts)
├── mockDb.js           # Re-exports / ties into db (helper for experiments)
├── new_panic.js        # Standalone / extracted panic-flow logic (development reference; not loaded by Vite by default)
├── test_browser.html   # Ad-hoc browser test page
├── check_env.js        # Env sanity helper
├── test_*.js, test_*.html
├── update_*.js         # One-off maintenance scripts (auth, UI, copy, etc.)
├── fix_*.js, inject_*.js, list_models.js, _find*.js
└── README.md           # This file
```

### What lives inside `index.html`

The file is large because it combines several concerns:

1. **Static shell** — `<head>` metadata, Tailwind CDN config, fonts, loading screen, inline CSS (gradients, dark mode–friendly layout).
2. **Env placeholders** — `window.__GEMINI_API_KEY__`, Firebase keys (filled at build time from `VITE_*` via Vite, or left as placeholders).
3. **Client app (React)** — A single `type="text/babel"` module that imports React, Framer Motion, Lucide, i18next, Gemini, and Firebase from CDNs / `node_modules` resolution through Vite. Major areas include:
   - **Auth & onboarding** — Email/password and Google-style OTP demo, doctor vs patient paths, optional doctor ID linking.
   - **Main experience** — Chat with Bree, journal, wellbeing scoring, settings (including doctor access and privacy copy).
   - **Panic help** — Step flashcards (breathing, 5‑4‑3‑2‑1 grounding, physical reset prompts) with progress persisted in `localStorage`.
4. **Firebase** — If `VITE_FIREBASE_*` is valid, real Auth/Firestore; otherwise a **mock Firestore** implementation stores data in `localStorage` (`mock_fs_*` keys).

There are no separate `components/` files: new UI is added as nested function components inside this module (watch for React pitfalls such as defining child components inside parents on every render).

### Runtime vs optional tooling

| You need this to… | Files |
|-------------------|--------|
| Run the app in dev | `index.html`, `vite.config.js`, `package.json`, `en.json`, `ar.json`, `.env` |
| Run production static preview | `npm run build` → output in `dist/` |
| Run API + static together | `server.js` + built `dist/` |
| Deploy with Docker / GCP | `Dockerfile`, `cloudbuild.yaml`, `.dockerignore` |
| Hack on one-off fixes or tests | `update_*.js`, `fix_*.js`, `test_*.js`, etc. (safe to ignore for day-to-day app development) |

### Tech stack (summary)

- **UI:** React (Babel in-browser), Tailwind CSS (CDN), Framer Motion, Lucide icons
- **i18n:** i18next (`en.json`, `ar.json`)
- **AI:** `@google/generative-ai` (Gemini)
- **Backend / tooling (Node):** Vite, Express, optional Firebase client SDK via ESM CDN

## Requirements

- **Node.js** 18+ (recommended)
- **npm** (ships with Node)

## Quick start

```bash
git clone <your-repo-url>
cd Breathe
npm install
```

Create a **`.env`** file in the project root (this file is listed in `.gitignore` and should not be committed):

| Variable | Purpose |
|----------|---------|
| `VITE_GEMINI_API_KEY` | Google AI (Gemini) API key for in-app chat and journaling features |
| `VITE_FIREBASE_API_KEY` | Optional — real Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Optional — Firebase auth domain (e.g. `project.firebaseapp.com`) |
| `VITE_GOOGLE_PROJECT_ID` | Used by tooling / Google Cloud–related scripts where applicable |
| `VITE_GOOGLE_LOCATION` | Region (e.g. Vertex / Google Cloud location) for related scripts |

If Firebase variables are missing or still placeholders, the app uses **mock Firestore** backed by `localStorage` and limited demo auth behavior.

Start the dev server:

```bash
npm run dev
```

By default Vite serves on **port 5173** with host binding enabled (see `vite.config.js`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy-start` | Serve `dist/` on `0.0.0.0:8080` (requires `serve`) |

## Production server (optional)

`server.js` is an **Express** app that:

- Serves the built app from `dist/`
- Exposes `/api/chat` and `/api/analyze` using `@google/generative-ai` and `VITE_GEMINI_API_KEY` from the environment

Typical flow:

```bash
npm run build
# ensure .env is present with VITE_GEMINI_API_KEY for the server
node server.js
```

Default listen address: **`0.0.0.0:8080`** (override with `PORT`).

## Security notes

- Do **not** commit API keys or `.env` files. Rotate any key that has been exposed in a repository.
- For production, prefer server-side proxying for AI calls if you need to hide keys from the browser entirely.

## License

Add your preferred license here.
