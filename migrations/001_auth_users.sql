-- Auth users table for AcademiX
-- Run this against your Postgres DB before using auth routes.

create table if not exists users (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null check (role in ('student', 'educator')),
  enrollment_id text,
  created_at timestamptz not null default now()
);

