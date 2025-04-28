/*
  # Add columns 2-10 as replicas of on_website

  1. Changes
    - Add new columns named '2' through '10' to final_list table
    - Copy values from on_website column to all new columns
    - Update sync trigger to handle all columns
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  FOR i IN 2..10 LOOP
    EXECUTE format('
      ALTER TABLE final_list 
      ADD COLUMN IF NOT EXISTS "%s" numeric DEFAULT 0
    ', i);
  END LOOP;
END $$;

-- Copy existing values from on_website to all new columns
UPDATE final_list SET
  "2" = on_website,
  "3" = on_website,
  "4" = on_website,
  "5" = on_website,
  "6" = on_website,
  "7" = on_website,
  "8" = on_website,
  "9" = on_website,
  "10" = on_website;

-- Create updated trigger function to sync all columns
CREATE OR REPLACE FUNCTION sync_website_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- If on_website changes, update all numeric columns
    IF NEW.on_website IS DISTINCT FROM OLD.on_website THEN
      NEW."1" := NEW.on_website;
      NEW."2" := NEW.on_website;
      NEW."3" := NEW.on_website;
      NEW."4" := NEW.on_website;
      NEW."5" := NEW.on_website;
      NEW."6" := NEW.on_website;
      NEW."7" := NEW.on_website;
      NEW."8" := NEW.on_website;
      NEW."9" := NEW.on_website;
      NEW."10" := NEW.on_website;
    -- If any numeric column changes, update on_website and all other columns
    ELSIF NEW."1" IS DISTINCT FROM OLD."1" OR
          NEW."2" IS DISTINCT FROM OLD."2" OR
          NEW."3" IS DISTINCT FROM OLD."3" OR
          NEW."4" IS DISTINCT FROM OLD."4" OR
          NEW."5" IS DISTINCT FROM OLD."5" OR
          NEW."6" IS DISTINCT FROM OLD."6" OR
          NEW."7" IS DISTINCT FROM OLD."7" OR
          NEW."8" IS DISTINCT FROM OLD."8" OR
          NEW."9" IS DISTINCT FROM OLD."9" OR
          NEW."10" IS DISTINCT FROM OLD."10" THEN
      -- Use the first non-null value to update all columns
      NEW.on_website := COALESCE(NEW."1", NEW."2", NEW."3", NEW."4", NEW."5",
                                NEW."6", NEW."7", NEW."8", NEW."9", NEW."10",
                                OLD.on_website);
      NEW."1" := NEW.on_website;
      NEW."2" := NEW.on_website;
      NEW."3" := NEW.on_website;
      NEW."4" := NEW.on_website;
      NEW."5" := NEW.on_website;
      NEW."6" := NEW.on_website;
      NEW."7" := NEW.on_website;
      NEW."8" := NEW.on_website;
      NEW."9" := NEW.on_website;
      NEW."10" := NEW.on_website;
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    -- For new rows, use on_website value or the first non-null numeric column
    NEW.on_website := COALESCE(NEW.on_website, NEW."1", NEW."2", NEW."3", NEW."4",
                              NEW."5", NEW."6", NEW."7", NEW."8", NEW."9", NEW."10", 0);
    NEW."1" := NEW.on_website;
    NEW."2" := NEW.on_website;
    NEW."3" := NEW.on_website;
    NEW."4" := NEW.on_website;
    NEW."5" := NEW.on_website;
    NEW."6" := NEW.on_website;
    NEW."7" := NEW.on_website;
    NEW."8" := NEW.on_website;
    NEW."9" := NEW.on_website;
    NEW."10" := NEW.on_website;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger to maintain synchronization
DROP TRIGGER IF EXISTS sync_website_columns_trigger ON final_list;
CREATE TRIGGER sync_website_columns_trigger
  BEFORE INSERT OR UPDATE ON final_list
  FOR EACH ROW
  EXECUTE FUNCTION sync_website_columns();