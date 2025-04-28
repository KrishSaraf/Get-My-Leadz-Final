/*
  # Create auth_users table for basic authentication

  1. Changes
    - Create auth_users table if it doesn't exist
    - Add policies if they don't exist
    - Add email index for performance
    
  2. Security
    - Check for existing policies before creating new ones
    - Maintain RLS settings
*/

-- Create auth_users table
CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text,
  logo text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Check and create select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' 
    AND policyname = 'Allow public read access for authentication'
  ) THEN
    CREATE POLICY "Allow public read access for authentication"
    ON auth_users
    FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Check and create insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_users' 
    AND policyname = 'Allow public insert for signup'
  ) THEN
    CREATE POLICY "Allow public insert for signup"
    ON auth_users
    FOR INSERT
    TO public
    WITH CHECK (true);
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users (email);