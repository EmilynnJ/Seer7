# SoulSeer

**A Community of Gifted Psychics** — production psychic marketplace platform.

## Structure

```
server/
  controllers/   # Request handlers (thin - validate, call service, respond)
  services/      # Business logic, DB access via Supabase admin client
  routes/        # Express routers, mounted under /api
  middleware/    # auth (JWT), error handling, rate limiting
  database/      # Supabase admin client + generated DB types
  billing/       # Pay-per-minute reading billing engine (Phase 7)
  cloudflare/    # Cloudflare Realtime session/credential service (Phase 9)
  stripe/        # Stripe webhooks, Checkout, Connect payouts (Phase 6)
src/             # Vite + React + TypeScript frontend (added in subsequent phases)
supabase/        # Supabase config, migrations
```

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + React Router + TanStack Query
- Backend: Node.js + Express + TypeScript + Zod
- Database/Auth: Supabase (Postgres + Auth + Storage + RLS)
- Payments: Stripe + Stripe Connect
- Realtime: Cloudflare Realtime (SFU/TURN)
- Live streaming: Cloudflare Stream / Mux
- Deployment: Vercel

## Development
```
npm install
npm run dev
```

See `.env.example` for required environment variables.

## Build status
This repository is being built phase-by-phase by an orchestrated multi-agent pipeline. See the "SoulSeer Build Progress" issue for phase completion status.
