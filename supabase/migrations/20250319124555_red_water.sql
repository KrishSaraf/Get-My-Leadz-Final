/*
  # Implement auto-incrementing wow value

  1. Changes
    - Add function to get next wow value
    - Add trigger to automatically set wow value on insert
    - Update existing records to have sequential wow values
*/

-- Function to get the next wow value
CREATE OR REPLACE FUNCTION get_next_wow()
RETURNS int2 AS $$
DECLARE
  next_val int2;
BEGIN
  SELECT COALESCE(MAX(wow), 0) + 1 INTO next_val FROM auth_users;
  RETURN next_val;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function
CREATE OR REPLACE FUNCTION set_wow_value()
RETURNS TRIGGER AS $$
BEGIN
  NEW.wow := get_next_wow();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_wow_trigger ON auth_users;
CREATE TRIGGER set_wow_trigger
  BEFORE INSERT ON auth_users
  FOR EACH ROW
  EXECUTE FUNCTION set_wow_value();

-- Update existing records to have sequential wow values
WITH numbered_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM auth_users
)
UPDATE auth_users
SET wow = numbered_rows.row_num
FROM numbered_rows
WHERE auth_users.id = numbered_rows.id;