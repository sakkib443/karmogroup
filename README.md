# karmogroup

Frontend for Karmo Group — foam, mattress, HomeTex and chemicals, manufacturing
in Bangladesh since 1965.

## Stack

Next.js 16 (App Router, JavaScript), Tailwind CSS v4, Redux Toolkit,
react-hook-form + zod, Framer Motion.

## Getting started

```bash
cd client
npm install
npm run dev
```

Opens on http://localhost:3001 (port 3000 is used by another local project).

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server on port 3001 (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server — respects `PORT`, defaults to 3000 |
| `npm run lint` | ESLint |

## Deploying

The app lives in `client/`, not at the repo root, so the host has to be
pointed at it or it will not detect a Node project:

- **Coolify** — set *Base Directory* to `/client`
- **Vercel** — set *Root Directory* to `client`

`npm start` deliberately does not hardcode a port; platforms that inject
`PORT` (Coolify, Railway, Render) need Next.js to read it.

## Structure

```
client/src/
  app/
    (mainLayout)/       public pages — header + footer
    (auth)/             login, register
    (dashboardLayout)/  dashboard
    globals.css         Tailwind theme tokens, hero/button utilities
  components/
    sheard/             Navbar, Footer, Sidebar
    Home/               Hero, About, Features
  config/api.js         API base URL
  redux/                store + slices
```

`@/*` is aliased to `client/src/*`.

## Notes

- The `korbo group/` reference folder (extracted static site, blueprint PDF,
  site-map spreadsheet, TVC videos) is git-ignored — it holds files far above
  GitHub's size limit.
- Hero and About imagery lives in `client/public`. Several older files there
  (`Foam.png`, `Hometex.png`, `why.PNG`, `adhesive.jpg`) came from the
  reference build and are no longer referenced by any component.
- Figures in the About section are derived from Karmo's own site map and
  founding year; confirm them before launch.
