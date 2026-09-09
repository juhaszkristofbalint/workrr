# WorkRR

Marketplace connecting customers with nearby professionals.

Three apps share one Next.js codebase:

- `/customer` — mobile-first customer app
- `/pro` — mobile-first professional app
- `/admin` — desktop admin dashboard

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add Supabase keys when you are ready. Without keys, auth uses a local demo session cookie so routing and layouts still work.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
