# PointLedger Online

This is the hosted version of PointLedger. It uses PostgreSQL instead of a local SQLite file, so customers can sign in from iPhone, Android, Mac, Windows, or any modern browser using your public HTTPS URL.

## Recommended deployment: Vercel + Prisma Postgres

1. Put this folder in a GitHub repository.
2. In Vercel, import the GitHub repository as a new project.
3. In the Vercel Marketplace, add **Prisma Postgres** to the project. It supplies `DATABASE_URL` automatically.
4. In Vercel > Project > Settings > Environment Variables, add:
   - `AUTH_SECRET` — a random secret of at least 32 characters.
   - `ADMIN_SEED_PASSWORD` — the initial password you want for the `admin` account.
5. Deploy. The included `vercel-build` command generates Prisma Client, applies committed migrations, and builds Next.js.
6. Seed the admin account once against the production database: run `npm run seed` from a trusted local/CI environment that has the production `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_SEED_PASSWORD` set. Do not expose these values to customers.
7. Visit the Vercel HTTPS URL and sign in as `admin` with the password from `ADMIN_SEED_PASSWORD`.

## Custom domain

After the app works on the Vercel URL, add your own domain in Vercel > Project > Settings > Domains and follow the DNS instructions shown there.

## Security notes

- Passwords are hashed with bcrypt (cost 12).
- Sessions are signed, HTTP-only, SameSite=Lax, and Secure in production.
- Admin/customer API routes enforce roles server-side.
- Point changes are server-side and atomic, with transaction + audit records.
- Login throttling is database-backed so it works across serverless instances.
- Security headers are configured in `next.config.ts`.
- Keep `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_SEED_PASSWORD` secret and only in server-side environment variables.
- Before handling high-value or regulated rewards, add MFA for admins, monitoring/alerts, automated backups, a stricter Content Security Policy, and an external security review.

## Local development

Create `.env` from `.env.example`, set a PostgreSQL `DATABASE_URL`, then:

```bash
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```
