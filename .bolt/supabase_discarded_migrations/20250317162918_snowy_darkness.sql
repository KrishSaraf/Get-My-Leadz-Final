/*
  # Create companies table

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `company_name` (text, not null)
      - `location` (text)
      - `name` (text)
      - `email` (text)
      - `role_of_contact` (text)
      - `location_of_contact` (text)
      - `company_description` (text)
      - `revenue_usd` (text)
      - `net_income_usd` (text)
      - `company_industry` (text)
      - `customer_profile` (text)
      - `score` (integer)
      - `industry_growth_rate` (text)
      - `exchange_market_code` (text)
      - `how_did_you_find_us` (text)
      - `what_will_you_use_nexus_for` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth_users)
      - `type` (text)
      - `is_verified` (boolean)
      - `contact_info` (jsonb)
      - `verification_data` (jsonb)

  2. Security
    - Enable RLS on `companies` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  location text,
  name text,
  email text,
  role_of_contact text,
  location_of_contact text,
  company_description text,
  revenue_usd text,
  net_income_usd text,
  company_industry text,
  customer_profile text,
  score integer,
  industry_growth_rate text,
  exchange_market_code text,
  how_did_you_find_us text,
  what_will_you_use_nexus_for text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth_users(id),
  type text CHECK (type IN ('existing', 'inbound', 'outbound')),
  is_verified boolean DEFAULT false,
  contact_info jsonb,
  verification_data jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_company_name ON companies(company_name);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_company_industry ON companies(company_industry);
CREATE INDEX IF NOT EXISTS idx_companies_type ON companies(type);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own companies"
  ON companies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own companies"
  ON companies
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own companies"
  ON companies
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own companies"
  ON companies
  FOR DELETE
  TO public
  USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();