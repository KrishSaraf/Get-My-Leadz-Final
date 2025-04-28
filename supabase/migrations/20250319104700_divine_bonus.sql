/*
  # Update column names and constraints for consistency

  1. Changes
    - Safely rename ID column to id if it exists
    - Ensure primary key constraint uses lowercase id
*/

DO $$ 
BEGIN
  -- Check if the old column exists before trying to rename
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'final_list' 
    AND column_name = 'ID'
  ) THEN
    ALTER TABLE "final_list" RENAME COLUMN "ID" TO "id";
  END IF;
END $$;

-- Ensure the primary key constraint exists with the correct column name
DO $$ 
BEGIN
  -- Drop the old constraint if it exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'final_list_pkey'
    AND table_name = 'final_list'
  ) THEN
    ALTER TABLE "final_list" DROP CONSTRAINT "final_list_pkey";
  END IF;
  
  -- Add the primary key constraint
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints 
    WHERE constraint_type = 'PRIMARY KEY'
    AND table_name = 'final_list'
  ) THEN
    ALTER TABLE "final_list" ADD PRIMARY KEY ("id");
  END IF;
END $$;