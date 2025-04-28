/*
  # Disable RLS on all tables

  1. Changes
    - Disable RLS on auth_users table
    - Disable RLS on final_list table
    - Drop existing policies
*/

-- Disable RLS on auth_users
ALTER TABLE auth_users DISABLE ROW LEVEL SECURITY;

-- Drop auth_users policies
DROP POLICY IF EXISTS "Allow public read access for authentication" ON auth_users;
DROP POLICY IF EXISTS "Allow public insert for signup" ON auth_users;
DROP POLICY IF EXISTS "Allow users to update their own records" ON auth_users;

-- Disable RLS on final_list
ALTER TABLE final_list DISABLE ROW LEVEL SECURITY;

-- Drop final_list policies
DROP POLICY IF EXISTS "Users can read own leads" ON final_list;
DROP POLICY IF EXISTS "Users can insert own leads" ON final_list;
DROP POLICY IF EXISTS "Users can update own leads" ON final_list;
DROP POLICY IF EXISTS "Users can delete own leads" ON final_list;
DROP POLICY IF EXISTS "Users can view all leads" ON final_list;
DROP POLICY IF EXISTS "Users can update their own lead status" ON final_list;