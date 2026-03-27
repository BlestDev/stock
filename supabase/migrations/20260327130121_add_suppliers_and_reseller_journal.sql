/*
  # Add Suppliers Table and Reseller Journal

  ## Overview
  Add suppliers management and detailed reseller journal tracking.

  ## New Tables

  ### 1. reseller_journals
  Detailed journal tracking consignments and sales for each reseller by product
  - `id` (uuid, primary key)
  - `reseller_client_id` (uuid) - Reference to reseller_clients
  - `product_id` (uuid) - Reference to products
  - `journal_date` (date) - Date of transaction
  - `transaction_type` (text) - consignment_given, sale_recorded, adjustment
  - `quantity_change` (decimal) - Positive for consignment/adjustment, negative for sales
  - `quantity_remaining` (decimal) - Quantity still owed after this transaction
  - `unit_price` (decimal) - Price per unit
  - `amount` (decimal) - Total amount for this transaction
  - `reference_id` (uuid) - Link to consignment or sale record
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)

  ## Changes
  - Add suppliers management (already created in previous migration)

  ## Security
  Row Level Security (RLS) enabled on new tables
*/

-- Create reseller_journals table
CREATE TABLE IF NOT EXISTS reseller_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_client_id uuid REFERENCES reseller_clients(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  journal_date date DEFAULT CURRENT_DATE,
  transaction_type text NOT NULL,
  quantity_change decimal(10,2) NOT NULL,
  quantity_remaining decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  amount decimal(10,2) NOT NULL,
  reference_id uuid,
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reseller_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reseller journals"
  ON reseller_journals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reseller journals"
  ON reseller_journals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reseller journals"
  ON reseller_journals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reseller_journals_reseller_id ON reseller_journals(reseller_client_id);
CREATE INDEX IF NOT EXISTS idx_reseller_journals_product_id ON reseller_journals(product_id);
CREATE INDEX IF NOT EXISTS idx_reseller_journals_user_id ON reseller_journals(user_id);
CREATE INDEX IF NOT EXISTS idx_reseller_journals_date ON reseller_journals(journal_date);