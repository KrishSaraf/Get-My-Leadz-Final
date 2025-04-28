/*
  # Enhance user data isolation and security

  1. Changes
    - Set default user_id for existing rows
    - Add NOT NULL constraint to user_id
    - Add cascade delete for user data
    - Update RLS policies for better security

  2. Security
    - Strengthen RLS policies
    - Ensure proper user data isolation
*/

-- First, get the first user's ID to use as default
DO $$ 
DECLARE
  default_user_id uuid;
BEGIN
  SELECT id INTO default_user_id FROM auth_users LIMIT 1;
  
  -- Update existing rows with the default user_id
  UPDATE "final_list" 
  SET user_id = default_user_id 
  WHERE user_id IS NULL;
END $$;

-- Now we can safely add the NOT NULL constraint
ALTER TABLE "final_list" 
ALTER COLUMN "user_id" SET NOT NULL;

-- Add cascade delete for user data
ALTER TABLE "final_list"
DROP CONSTRAINT IF EXISTS "final_list_user_id_fkey",
ADD CONSTRAINT "final_list_user_id_fkey"
  FOREIGN KEY (user_id)
  REFERENCES auth_users(id)
  ON DELETE CASCADE;

-- Update RLS policies for better security
DROP POLICY IF EXISTS "Users can read own leads" ON "final_list";
DROP POLICY IF EXISTS "Users can insert own leads" ON "final_list";
DROP POLICY IF EXISTS "Users can update own leads" ON "final_list";
DROP POLICY IF EXISTS "Users can delete own leads" ON "final_list";

CREATE POLICY "Users can read own leads"
ON "final_list"
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
ON "final_list"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
ON "final_list"
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
ON "final_list"
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);