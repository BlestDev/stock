/*
  # Add Reseller Management System

  ## Overview
  Add tables and functionality for managing reseller clients who receive products on consignment
  and pay based on their sales.

  ## New Tables

  ### 1. reseller_clients
  Special clients who buy on consignment and pay later
  - `id` (uuid, primary key)
  - `client_id` (uuid) - Reference to the base clients table
  - `credit_limit` (decimal) - Maximum credit allowed
  - `current_balance` (decimal) - Current amount owed
  - `status` (text) - active, suspended, closed
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. consignments
  Products given to resellers on consignment
  - `id` (uuid, primary key)
  - `reseller_client_id` (uuid) - Reference to reseller_clients
  - `product_id` (uuid) - Reference to products
  - `quantity_given` (decimal) - Quantity given to reseller
  - `quantity_remaining` (decimal) - Quantity not yet paid for
  - `unit_price` (decimal) - Price per unit for this consignment
  - `total_value` (decimal) - Total value of consignment
  - `status` (text) - active, completed, cancelled
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. reseller_sales
  Sales made by reseller and payments
  - `id` (uuid, primary key)
  - `reseller_client_id` (uuid) - Reference to reseller_clients
  - `sale_date` (date) - Date of sale
  - `quantity_sold` (decimal) - Quantity sold by reseller
  - `total_revenue` (decimal) - Revenue from sales
  - `amount_paid` (decimal) - Amount paid to us
  - `payment_date` (date) - Date of payment
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)

  ### 4. consignment_balances
  Track balance history for each reseller
  - `id` (uuid, primary key)
  - `reseller_client_id` (uuid) - Reference to reseller_clients
  - `transaction_type` (text) - consignment_given, sale_recorded, payment_received
  - `amount` (decimal) - Amount owed or paid
  - `reference_id` (uuid) - ID of related transaction
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)

  ## Security
  Row Level Security (RLS) enabled on all new tables
*/

-- Create reseller_clients table
CREATE TABLE IF NOT EXISTS reseller_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  credit_limit decimal(10,2) DEFAULT 0,
  current_balance decimal(10,2) DEFAULT 0,
  status text DEFAULT 'active',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reseller_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reseller clients"
  ON reseller_clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reseller clients"
  ON reseller_clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reseller clients"
  ON reseller_clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reseller clients"
  ON reseller_clients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create consignments table
CREATE TABLE IF NOT EXISTS consignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_client_id uuid REFERENCES reseller_clients(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity_given decimal(10,2) NOT NULL,
  quantity_remaining decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_value decimal(10,2) NOT NULL,
  status text DEFAULT 'active',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consignments"
  ON consignments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consignments"
  ON consignments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consignments"
  ON consignments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own consignments"
  ON consignments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reseller_sales table
CREATE TABLE IF NOT EXISTS reseller_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_client_id uuid REFERENCES reseller_clients(id) ON DELETE CASCADE NOT NULL,
  sale_date date DEFAULT CURRENT_DATE,
  quantity_sold decimal(10,2) NOT NULL,
  total_revenue decimal(10,2) NOT NULL,
  amount_paid decimal(10,2) DEFAULT 0,
  payment_date date,
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reseller_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reseller sales"
  ON reseller_sales FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reseller sales"
  ON reseller_sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reseller sales"
  ON reseller_sales FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reseller sales"
  ON reseller_sales FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create consignment_balances table
CREATE TABLE IF NOT EXISTS consignment_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_client_id uuid REFERENCES reseller_clients(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  reference_id uuid,
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consignment_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own balance transactions"
  ON consignment_balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own balance transactions"
  ON consignment_balances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own balance transactions read"
  ON consignment_balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reseller_clients_user_id ON reseller_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_reseller_clients_client_id ON reseller_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_consignments_user_id ON consignments(user_id);
CREATE INDEX IF NOT EXISTS idx_consignments_reseller_client_id ON consignments(reseller_client_id);
CREATE INDEX IF NOT EXISTS idx_reseller_sales_user_id ON reseller_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_reseller_sales_reseller_client_id ON reseller_sales(reseller_client_id);
CREATE INDEX IF NOT EXISTS idx_consignment_balances_user_id ON consignment_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_consignment_balances_reseller_client_id ON consignment_balances(reseller_client_id);