# GPU Pulse Platform

Next.js full-stack platform for GPU hardware, AI computing, and gaming systems.

## Stack

- Next.js App Router
- JavaScript
- CSS
- Prisma ORM
- Supabase Postgres
- NextAuth

## Supabase Setup

1. Create a Supabase project.
2. Open Project Settings > Database.
3. Copy:
	- Session pooler connection string
	- Direct connection string
4. Update local env values in .env:
	- DATABASE_URL = pooler connection string
	- DIRECT_URL = direct connection string
	- SUPABASE_URL = your project URL
	- SUPABASE_ANON_KEY = anon key
	- SUPABASE_SERVICE_ROLE_KEY = service role key

## Install and Run

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Default Seeded Logins

- Admin: admin@gpupulse.com / Admin123!
- Editor: editor@gpupulse.com / Editor123!

## Security

- Never expose SUPABASE_SERVICE_ROLE_KEY in client code.
- Never commit .env to source control.
