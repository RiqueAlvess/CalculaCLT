-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- before wiring up the paid PDF report flow.
--
-- This table is a short-lived bridge between the free, client-side
-- calculators and the Kiwify checkout: we save the calculation the user
-- just ran, redirect them to Kiwify with the row's id as the `s1` tracking
-- parameter, and once the purchase webhook confirms payment we look the
-- row back up by that id to generate and email the PDF.

create extension if not exists pgcrypto;

create table if not exists pending_reports (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('fgts', 'ferias')),
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired')),
  customer_name text,
  customer_email text,
  kiwify_order_ref text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  paid_at timestamptz
);

create index if not exists pending_reports_expires_at_idx on pending_reports (expires_at);

-- Row Level Security is enabled with NO permissive policies for the
-- anon/public role. All reads/writes go through the service_role key from
-- our server-only Next.js API routes (see lib/supabase.ts), which bypasses
-- RLS entirely. This keeps salary/date data from being listable or
-- readable by anyone holding only the public anon key.
alter table pending_reports enable row level security;

-- Optional: a scheduled cleanup you can run periodically (e.g. via the
-- Supabase SQL editor, a cron job, or a pg_cron extension) to drop rows
-- past their expiry instead of just filtering them out at query time:
-- delete from pending_reports where expires_at < now();
