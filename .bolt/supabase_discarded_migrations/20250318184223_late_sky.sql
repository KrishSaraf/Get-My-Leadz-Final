/*
  # Create final_list table with on_website flag

  1. New Tables
    - `final_list`
      - `ID` (uuid, primary key)
      - `company_name` (text, not null)
      - `type` (text, not null)
      - `location` (text)
      - `name` (text)
      - `email` (text)
      - `role_of_contact` (text)
      - `location_of_contact` (text)
      - `company_description` (text)
      - `revenue_usd` (text)
      - `company_industry` (text)
      - `customer_profile` (text)
      - `subscription` (text)
      - `score` (text)
      - `industry_growth_rate` (text)
      - `exchange_market_code` (text)
      - `how_did_you_find_us` (text)
      - `what_will_you_use_nexus_for` (text)
      - `on_website` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `final_list` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS "final_list" (
  "ID" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "company_name" text NOT NULL,
  "type" text NOT NULL CHECK ("type" IN ('existing', 'inbound', 'outbound')),
  "location" text,
  "name" text,
  "email" text,
  "role_of_contact" text,
  "location_of_contact" text,
  "company_description" text,
  "revenue_usd" text,
  "company_industry" text,
  "customer_profile" text,
  "subscription" text,
  "score" text,
  "industry_growth_rate" text,
  "exchange_market_code" text,
  "how_did_you_find_us" text,
  "what_will_you_use_nexus_for" text,
  "on_website" integer DEFAULT 0,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE "final_list" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON "final_list"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON "final_list"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON "final_list"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON "final_list"
  FOR DELETE
  TO authenticated
  USING (true);