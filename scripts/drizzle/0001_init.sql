-- baseline migration (idempotent)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id            bigserial PRIMARY KEY,
  username      text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN (
    'administrator','suboperator','master-agent','sub-agent','agent','player','declarator'
  )),
  created_at    timestamptz NOT NULL DEFAULT now()
);
