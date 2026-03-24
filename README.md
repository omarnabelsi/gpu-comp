# GPU Pulse Platform

Next.js full-stack platform for GPU hardware, AI computing, and gaming systems.

**Features:**
- 3D product viewer (Spline) at `/gpu-3d`
- Session preloader and landing UX
- Auth with NextAuth
- Postgres via Supabase + Prisma ORM

**Stack:**
- Next.js (App Router)
- React 19
- Tailwind / CSS
- Prisma
- Supabase

## Getting started (local)

Prerequisites: Node.js (>=18), npm, and a Supabase project (if using DB features).

Install and run locally:

```bash
npm install
# if you use the database:
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000 in your browser.

## Developer notes

- The `dev` script in `package.json` currently uses Webpack to avoid local Turbopack panics: `next dev --webpack`.
- The 3D page lives at `app/gpu-3d/page.jsx` and uses `@splinetool/react-spline`.
- The one-time session preloader uses `sessionStorage` with the key `gpu-pulse-preloader-seen`.

## Common issues & quick fixes

- Windows + Prisma: if `npm install` fails with an EPERM rename on `query_engine-windows.dll.node.tmp`, stop Node processes and remove the temp engine files then re-run `npm install`:

```powershell
# from project root
Get-Process node | Stop-Process -Force
Remove-Item .\node_modules\.prisma\client\query_engine-windows.dll.node.tmp* -Force -ErrorAction SilentlyContinue
npm install
```

- If Next dev repeatedly panics with Turbopack errors, try the webpack fallback above.

## Deployment

- Vercel is supported; ensure environment variables (Supabase keys, DATABASE_URL) are set in the project settings.
- Do not commit `.env` or service role keys to the repository.

## Contributing

- Make a branch, test locally, and open a PR. Keep changes focused.

## License

- MIT (or your preferred license)

---

Updated: concise developer instructions and troubleshooting notes.
