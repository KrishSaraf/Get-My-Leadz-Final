/*
  # Update auth_users table schema

  1. Changes
    - Drop existing auth_users table if it exists
    - Create auth_users table with correct schema
    - Remove RLS and policies
*/

-- Drop existing table
DROP TABLE IF EXISTS auth_users;

-- Create auth_users table with correct schema
CREATE TABLE auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  wow int2
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users (email);