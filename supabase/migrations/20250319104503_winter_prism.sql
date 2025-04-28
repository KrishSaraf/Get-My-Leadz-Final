/*
  # Add user_id to final_list table

  1. Changes
    - Add user_id column to final_list table
    - Add foreign key constraint to auth_users
    - Update RLS policies to be user-specific
    - Add index on user_id and on_website columns for better query performance

  2. Security
    - Modify RLS policies to ensure users can only access their own leads
*/

-- Add user_id column
ALTER TABLE "final_list" 
ADD COLUMN IF NOT EXISTS "user_id" uuid REFERENCES auth_users(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_final_list_user_website 
ON "final_list" (user_id, on_website);

-- Update RLS policies
ALTER TABLE "final_list" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON "final_list";
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON "final_list";
DROP POLICY IF EXISTS "Enable update for authenticated users" ON "final_list";
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON "final_list";

CREATE POLICY "Users can read own leads"
ON "final_list"
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own leads"
ON "final_list"
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own leads"
ON "final_list"
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own leads"
ON "final_list"
FOR DELETE
TO authenticated
USING (user_id = auth.uid());