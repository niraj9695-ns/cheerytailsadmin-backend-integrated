# CheeryTails Admin

Admin panel for CheeryTails, hosted at [admin.cheerytails.com](https://admin.cheerytails.com).

## Environment

| Variable | Description | Production |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (no trailing slash) | `https://www.cheerytails.com/cheerytail` |
| `VITE_APP_URL` | Public URL of this admin panel | `https://admin.cheerytails.com` |

- `.env.development` — used by `npm run dev`
- `.env.production` — used by `npm run build`
- `.env.local` — optional local overrides (gitignored)

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build:prod
```

Output is written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Deploy to admin.cheerytails.com

### Option 1: Nginx (VPS / dedicated server)

1. Run `npm run build:prod` on the server or in CI.
2. Copy the `dist/` folder to `/var/www/cheerytailsadmin/dist`.
3. Use `nginx.conf.example` as a starting point.
4. Point DNS `admin.cheerytails.com` to the server and enable SSL (Let's Encrypt).

### Option 2: Vercel

1. Connect the repo to Vercel.
2. Set environment variable `VITE_API_BASE_URL` to your production API URL.
3. Deploy — `vercel.json` handles SPA routing and security headers.

### Option 3: Netlify

1. Connect the repo to Netlify.
2. Set `VITE_API_BASE_URL` in site environment variables.
3. Deploy — `netlify.toml` handles build and redirects.

## Backend requirements

Ensure the CheeryTails API allows requests from the admin origin:

- `https://admin.cheerytails.com`

Configure CORS on the backend if API calls fail in production.

## Security notes

- Admin panel is marked `noindex, nofollow` (not for public search indexing).
- Security headers are configured in `vercel.json`, `netlify.toml`, and `nginx.conf.example`.
- Auth tokens are stored in `localStorage`; always serve over HTTPS in production.
