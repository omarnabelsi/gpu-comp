# Deployment Guide: Vercel

This guide explains how to deploy the GPU Tech project to Vercel.

## Prerequisites

1. **Vercel account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub repository**: This project is already pushed to GitHub
3. **Database**: PostgreSQL instance (Supabase recommended)
4. **Environment variables configured**

## Quick Start

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Find and select `omarnabelsi/gpu-comp`
5. Click **"Import"**

### Step 2: Configure Environment Variables

In the Vercel dashboard, add the following secrets before deploying:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (pooler) | `postgresql://user:password@aws-1-*.pooler.supabase.com:5432/postgres` |
| `DIRECT_URL` | Direct PostgreSQL URL (for migrations) | `postgresql://user:password@db.*.supabase.co:5432/postgres` |
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon key (for public client usage) | From Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | From Supabase Settings → API |
| `NEXTAUTH_SECRET` | JWT signing secret (min 32 chars) | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production domain | `https://yourdomain.com` |

**To get Supabase credentials:**
1. Log in to [Supabase](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the Project URL and anon/service role keys

### Step 3: Deploy

1. Add the environment variables in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add each variable from the table above
2. Click **"Deploy"**
3. Wait for deployment to complete
4. Visit your deployed site when ready

## Troubleshooting

### Vercel Project Root Directory

This repository contains the app in the `gpu-tech` subfolder. In Vercel, set:

- **Root Directory**: `gpu-tech`

If root directory is left at repository root, Next.js and API route detection can fail.

### Build Fails with Prisma Errors

- Ensure `DIRECT_URL` is set correctly for schema migrations
- Verify the database user has permission to create tables
- Check logs: **Deployments** → **Select a deployment** → **View Build Logs**

### Port Already in Use

The app uses port 3000. Vercel handles this automatically; no config needed.

### Authentication Not Working

- Verify `NEXTAUTH_SECRET` is set (min 32 characters, change from example)
- Ensure `NEXTAUTH_URL` matches your production domain exactly
- Check NextAuth logs if sign-in redirects fail

### Database Connection Issues

- Use `DATABASE_URL` for runtime connections (should use pooler)
- Use `DIRECT_URL` for migrations (direct connection needed)
- Both should point to the same database

## Post-Deployment

### First Time Setup

1. After first deployment, manually seed the database:
   ```bash
   npx prisma db seed
   ```
   Or use the Vercel CLI to run it as a one-off job:
   ```bash
   vercel env pull
   npm run db:seed
   ```

2. Create an admin user:
   - Navigate to signup page
   - Use the dashboard to promote users to admin role

### Monitor Deployments

- View logs at **Deployments** → Select deployment → **View Build Logs**
- Check function usage at **Monitoring** → **Function Duration**
- Monitor database at Supabase dashboard

## Production Checklist

- [ ] Environment variables set and not exposed
- [ ] `NEXTAUTH_URL` updated to production domain
- [ ] `NEXTAUTH_SECRET` changed from example (use `openssl rand -base64 32`)
- [ ] Database backups configured (Supabase: Settings → Backups)
- [ ] Custom domain configured (Vercel: Settings → Domains)
- [ ] SSL certificate auto-enabled (Vercel handles this)
- [ ] Error reporting configured (optional: Sentry integration)

## Rollback

To rollback to a previous deployment:
1. Go to **Deployments** → Select a past deployment
2. Click the three-dot menu
3. Select **"Promote to Production"**

## Next Steps

- Set up preview deployments for pull requests (automatic)
- Configure custom domain and CNAME (Vercel: Settings → Domains)
- Enable automatic deployments on `main` branch push
- Consider adding error tracking (e.g., Sentry, Rollbar)

For more help, see:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment/vercel)
- [Prisma Deployment](https://www.prisma.io/docs/guides/performance-and-optimization/connection-pool)
