/*
  # Update existing customers type

  1. Changes
    - Set type = 'existing' for all customers that don't have a type set
    - This will make them appear in the Customers page

  2. Notes
    - Only updates records where type is null
    - Preserves all other data
*/

UPDATE companies 
SET 
  type = 'existing',
  updated_at = now()
WHERE type IS NULL;