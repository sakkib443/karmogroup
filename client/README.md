# Karmo — Client

Next.js 16 (App Router) frontend, JavaScript, Tailwind CSS v4, Redux Toolkit.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server on port 3000 (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server on port 5005 |
| `npm run lint` | ESLint |

## Structure

```
src/
  app/
    (mainLayout)/       public pages — navbar + footer
    (auth)/             login, register — centered card layout
    (dashboardLayout)/  dashboard — sidebar layout
    layout.js           root: fonts + providers
    globals.css         Tailwind + brand tokens
  components/
    sheard/             Navbar, Footer, Sidebar
    Home/               Hero, Features
    ReduxProviderWrapper.jsx
  config/api.js         API base URL
  context/              React contexts
  lib/                  helpers
  redux/                store + slices
```

## Environment

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`@/*` is aliased to `src/*` (see `jsconfig.json`).
