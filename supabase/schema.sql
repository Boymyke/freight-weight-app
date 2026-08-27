create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz default now()
);

create table if not exists loads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  load_number text unique not null,
  customer text not null,
  origin text,
  destination text,
  delivered_at timestamptz,
  customer_amount numeric(12,2) default 0,
  status text not null default 'review',
  invoice_ready_at timestamptz,
  invoiced_at timestamptz,
  owner text,
  created_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  load_id uuid references loads(id) on delete cascade,
  type text not null,
  url text,
  verified boolean default false,
  issue text,
  created_at timestamptz default now()
);

create table if not exists exceptions (
  id uuid primary key default gen_random_uuid(),
  load_id uuid references loads(id) on delete cascade,
  category text not null,
  title text not null,
  description text,
  revenue_risk numeric(12,2) default 0,
  status text not null default 'open',
  assigned_to text,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create table if not exists accessorials (
  id uuid primary key default gen_random_uuid(),
  load_id uuid references loads(id) on delete cascade,
  type text not null,
  carrier_amount numeric(12,2) default 0,
  customer_amount numeric(12,2) default 0,
  evidence_attached boolean default false,
  approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists audit_runs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  score integer not null,
  notes jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists loads_company_idx on loads(company_id);
create index if not exists loads_status_idx on loads(status);
create index if not exists exceptions_status_idx on exceptions(status);
