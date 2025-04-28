-- Add new column '1' if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'final_list' 
    AND column_name = '1'
  ) THEN
    ALTER TABLE final_list 
    ADD COLUMN "1" numeric DEFAULT 0;
  END IF;
END $$;

-- Copy existing values from on_website to new column '1' (one-time operation)
UPDATE final_list 
SET "1" = on_website;

-- Ensure new rows also copy the value once upon insertion
CREATE OR REPLACE FUNCTION copy_website_value()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."1" IS NULL THEN
    NEW."1" := NEW.on_website;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger only for new inserts
DROP TRIGGER IF EXISTS copy_website_value_trigger ON final_list;
CREATE TRIGGER copy_website_value_trigger
  BEFORE INSERT ON final_list
  FOR EACH ROW
  EXECUTE FUNCTION copy_website_value();
