/*
  # Create user_info table and authentication system

  1. New Tables
    - user_info
      - id (uuid, primary key)
      - email (text, unique)
      - password (text)
      - name (text)
      - logo (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on user_info table
    - Add policies for user access
*/

-- Create user_info table
CREATE TABLE IF NOT EXISTS user_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text,
  logo text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access for authentication"
ON user_info
FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Allow public insert for signup"
ON user_info
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_info_email ON user_info (email);