# BeautySalon backend (Phase 1)

## Implemented
- `GET /api/catalog`: public site settings, active services, products, memberships.
- `POST /api/appointments`: validates and stores **pending appointment requests**, not confirmed bookings.
- `GET /api/admin`: admin-only overview of site settings, catalog, staff, and recent appointment requests.
- `PATCH /api/admin`: admin-only site settings updates and pending/declined/cancelled appointment status changes.
- `POST /api/admin`: admin-only creation of services, products, staff, and memberships.
- `db/schema.sql`: PostgreSQL tables, constraints, indexes, and basic settings row.

## Setup
1. Create a **new dedicated Neon PostgreSQL database** (do not reuse another website's production database).
2. Set `DATABASE_URL` and a unique 32+ character `ADMIN_API_KEY` in local `.env.local` and Vercel environment variables. Never commit secrets.
3. Run `db/schema.sql` against that database using Neon's SQL editor.
4. Run `npm install` and `npm run dev`. Test `GET /api/catalog`.
5. To test admin endpoints, supply `Authorization: Bearer <ADMIN_API_KEY>` **from a trusted server-side client**, not from public frontend JavaScript.

## Important limitations
- The existing website editor is a **localStorage demo**; it is **not connected to the admin API**. Do not paste an admin API key into the browser.
- The existing booking form and shopping cart are **UI demonstrations**. They do not submit to the API or process payments.
- The request endpoint currently does not include rate limiting, spam protection, verification, consent management, or email notifications. Protect it before public launch.
- Appointment requests are not live availability. **Never automatically mark them confirmed.** Scheduling, timezone rules, staff working hours, buffers, and concurrency-safe conflict checks still need implementation.
- No customer login, order checkout, Stripe webhooks, shipping, subscription billing, or CMS media uploads yet.
- Admin API uses a server secret for initial integration; replace with secure role-based login and audit logging before letting staff use it.
- Add migrations, backups, monitoring, tests, and production hardening before accepting customer information.

## Example admin request (trusted terminal only)
```bash
curl -H "Authorization: Bearer $ADMIN_API_KEY" http://localhost:3000/api/admin
```

The backend foundation is separate from the production UI and requires database provisioning, integration and security work before launch.
