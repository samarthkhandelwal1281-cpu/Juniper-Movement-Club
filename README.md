# Juniper Movement Club

A boutique fitness studio landing page and booking app built with React Router, Cloudflare Workers, and Durable Object SQLite.

## Features

- Minimalist, responsive studio landing page with class descriptions and a weekly schedule.
- Booking form with server-side validation; reservations persist in the BookingStore Durable Object.
- Private owner roster at `/studio-admin`, protected by a passphrase and HTTP-only session cookie.

## Local development

Requires Bun and a Cloudflare Workers-compatible environment.

```sh
bun install
bun run dev
```

Useful commands: `bun run typecheck` and `bun run build`.

## Owner access key

The repository stores only a SHA-256 verifier for the high-entropy owner passphrase; the passphrase itself is not committed. The access key was provided privately to the owner. To rotate it, replace `ADMIN_PASSWORD_HASH` in `app/routes/admin.tsx` with the lowercase SHA-256 hex digest of a new random, high-entropy passphrase. Do not use a human-chosen password or commit the raw key.

## Deployment

The app uses a Cloudflare Durable Object binding and SQLite migration declared in `wrangler.jsonc`. Deploy with the project's configured Cloudflare Workers workflow. Update the example studio branding, class descriptions, and starter weekly timetable before using it with real customers.
