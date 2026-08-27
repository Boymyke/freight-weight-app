# Relay — Freight Revenue Control Demo

A focused Next.js sales demo for the **delivery-to-cash** problem in freight brokerages and 3PLs.

Relay is intentionally **not** a TMS. It demonstrates an exception and revenue-control layer around an existing TMS/accounting workflow.

## Screens
- `/` — executive control center
- `/loads` — delivered loads and billing readiness
- `/exceptions` — blocked/review queue
- `/revenue` — accessorial revenue review
- `/audit` — interactive delivery-to-cash audit
- `/analytics` — exception aging and management metrics
- `/loads/[id]` — individual load/document/reconciliation detail

## Stack
- Next.js 16 + TypeScript
- Supabase/Postgres schema included in `supabase/schema.sql`
- Lucide icons
- Mock data for the demo; swap in Supabase queries after the sales workflow is validated

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Supabase
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add your project URL and anon key.

## Product rule
Do not turn Relay into another TMS yet. Keep the demo centered on:
1. delivered but not invoice-ready loads,
2. document exceptions,
3. carrier/customer billing mismatches,
4. accessorial recovery,
5. exception aging and ownership.

Use discovery calls and audits to decide which integrations and automations deserve real development.
