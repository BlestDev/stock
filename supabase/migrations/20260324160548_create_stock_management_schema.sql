/*
  # Stock Management System Database Schema

  ## Overview
  Complete database schema for a stock management system with products, clients, sales, purchases, expenses, and invoicing.

  ## New Tables

  ### 1. categories
  Product categories for organizing inventory
  - `id` (uuid, primary key)
  - `name` (text, unique) - Category name
  - `description` (text) - Category description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. units
  Measurement units for products (kg, pieces, liters, etc.)
  - `id` (uuid, primary key)
  - `name` (text, unique) - Unit name
  - `symbol` (text) - Unit symbol
  - `created_at` (timestamptz)

  ### 3. products
  Product inventory management
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `sku` (text, unique) - Stock keeping unit code
  - `category_id` (uuid) - Reference to categories
  - `unit_id` (uuid) - Reference to units
  - `description` (text)
  - `purchase_price` (decimal) - Cost price
  - `sale_price` (decimal) - Selling price
  - `stock_quantity` (decimal) - Current stock level
  - `min_stock` (decimal) - Minimum stock alert level
  - `max_stock` (decimal) - Maximum stock level
  - `is_active` (boolean) - Product status
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. clients
  Customer management
  - `id` (uuid, primary key)
  - `name` (text) - Client name
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `postal_code` (text)
  - `country` (text)
  - `tax_id` (text) - Tax identification number
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. suppliers
  Supplier management for purchases
  - `id` (uuid, primary key)
  - `name` (text) - Supplier name
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `postal_code` (text)
  - `country` (text)
  - `tax_id` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. sales
  Sales transactions
  - `id` (uuid, primary key)
  - `sale_number` (text, unique) - Sale reference number
  - `client_id` (uuid) - Reference to clients
  - `sale_date` (date) - Date of sale
  - `subtotal` (decimal) - Subtotal before tax
  - `tax_amount` (decimal) - Tax amount
  - `discount_amount` (decimal) - Discount applied
  - `total_amount` (decimal) - Final total
  - `payment_status` (text) - pending, partial, paid
  - `payment_method` (text) - cash, card, transfer, etc.
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. sale_items
  Line items for sales
  - `id` (uuid, primary key)
  - `sale_id` (uuid) - Reference to sales
  - `product_id` (uuid) - Reference to products
  - `quantity` (decimal) - Quantity sold
  - `unit_price` (decimal) - Price per unit
  - `tax_rate` (decimal) - Tax percentage
  - `discount_rate` (decimal) - Discount percentage
  - `subtotal` (decimal) - Line subtotal
  - `total` (decimal) - Line total
  - `created_at` (timestamptz)

  ### 8. purchases
  Purchase transactions
  - `id` (uuid, primary key)
  - `purchase_number` (text, unique) - Purchase reference number
  - `supplier_id` (uuid) - Reference to suppliers
  - `purchase_date` (date) - Date of purchase
  - `subtotal` (decimal)
  - `tax_amount` (decimal)
  - `discount_amount` (decimal)
  - `total_amount` (decimal)
  - `payment_status` (text) - pending, partial, paid
  - `payment_method` (text)
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. purchase_items
  Line items for purchases
  - `id` (uuid, primary key)
  - `purchase_id` (uuid) - Reference to purchases
  - `product_id` (uuid) - Reference to products
  - `quantity` (decimal)
  - `unit_price` (decimal)
  - `tax_rate` (decimal)
  - `discount_rate` (decimal)
  - `subtotal` (decimal)
  - `total` (decimal)
  - `created_at` (timestamptz)

  ### 10. expenses
  Business expenses tracking
  - `id` (uuid, primary key)
  - `expense_number` (text, unique)
  - `category` (text) - Expense category
  - `description` (text)
  - `amount` (decimal)
  - `expense_date` (date)
  - `payment_method` (text)
  - `reference` (text) - Invoice/receipt reference
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 11. stock_movements
  Stock movement tracking (in/out/adjustment)
  - `id` (uuid, primary key)
  - `product_id` (uuid) - Reference to products
  - `movement_type` (text) - in, out, adjustment
  - `quantity` (decimal) - Positive or negative
  - `reference_type` (text) - sale, purchase, adjustment, etc.
  - `reference_id` (uuid) - ID of related transaction
  - `notes` (text)
  - `movement_date` (timestamptz)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)

  ### 12. invoices
  Invoice generation and management
  - `id` (uuid, primary key)
  - `invoice_number` (text, unique)
  - `client_id` (uuid) - Reference to clients
  - `invoice_date` (date)
  - `due_date` (date)
  - `subtotal` (decimal)
  - `tax_amount` (decimal)
  - `discount_amount` (decimal)
  - `total_amount` (decimal)
  - `payment_status` (text) - pending, partial, paid, overdue
  - `notes` (text)
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 13. invoice_items
  Line items for invoices
  - `id` (uuid, primary key)
  - `invoice_id` (uuid) - Reference to invoices
  - `product_id` (uuid) - Reference to products
  - `description` (text)
  - `quantity` (decimal)
  - `unit_price` (decimal)
  - `tax_rate` (decimal)
  - `discount_rate` (decimal)
  - `subtotal` (decimal)
  - `total` (decimal)
  - `created_at` (timestamptz)

  ### 14. settings
  Application settings
  - `id` (uuid, primary key)
  - `company_name` (text)
  - `company_email` (text)
  - `company_phone` (text)
  - `company_address` (text)
  - `tax_rate` (decimal) - Default tax rate
  - `currency` (text) - Currency code
  - `invoice_prefix` (text) - Invoice number prefix
  - `sale_prefix` (text) - Sale number prefix
  - `purchase_prefix` (text) - Purchase number prefix
  - `user_id` (uuid) - Owner reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  Row Level Security (RLS) enabled on all tables with policies for authenticated users to manage their own data.
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  symbol text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all units"
  ON units FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create units"
  ON units FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update units"
  ON units FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete units"
  ON units FOR DELETE
  TO authenticated
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  unit_id uuid REFERENCES units(id) ON DELETE SET NULL,
  description text DEFAULT '',
  purchase_price decimal(10,2) DEFAULT 0,
  sale_price decimal(10,2) DEFAULT 0,
  stock_quantity decimal(10,2) DEFAULT 0,
  min_stock decimal(10,2) DEFAULT 0,
  max_stock decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  postal_code text DEFAULT '',
  country text DEFAULT '',
  tax_id text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  postal_code text DEFAULT '',
  country text DEFAULT '',
  tax_id text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  sale_date date DEFAULT CURRENT_DATE,
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  payment_status text DEFAULT 'pending',
  payment_method text DEFAULT 'cash',
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sales"
  ON sales FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales"
  ON sales FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales"
  ON sales FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0,
  discount_rate decimal(5,2) DEFAULT 0,
  subtotal decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sale items"
  ON sale_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own sale items"
  ON sale_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own sale items"
  ON sale_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own sale items"
  ON sale_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()
  ));

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_number text UNIQUE NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  purchase_date date DEFAULT CURRENT_DATE,
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  payment_status text DEFAULT 'pending',
  payment_method text DEFAULT 'cash',
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases"
  ON purchases FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own purchases"
  ON purchases FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create purchase_items table
CREATE TABLE IF NOT EXISTS purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid REFERENCES purchases(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0,
  discount_rate decimal(5,2) DEFAULT 0,
  subtotal decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchase items"
  ON purchase_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own purchase items"
  ON purchase_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own purchase items"
  ON purchase_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own purchase items"
  ON purchase_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid()
  ));

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_number text UNIQUE NOT NULL,
  category text DEFAULT '',
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  expense_date date DEFAULT CURRENT_DATE,
  payment_method text DEFAULT 'cash',
  reference text DEFAULT '',
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  movement_type text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  reference_type text DEFAULT '',
  reference_id uuid,
  notes text DEFAULT '',
  movement_date timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stock movements"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own stock movements"
  ON stock_movements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stock movements"
  ON stock_movements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stock movements"
  ON stock_movements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  invoice_date date DEFAULT CURRENT_DATE,
  due_date date,
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  payment_status text DEFAULT 'pending',
  notes text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0,
  discount_rate decimal(5,2) DEFAULT 0,
  subtotal decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoice items"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own invoice items"
  ON invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own invoice items"
  ON invoice_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own invoice items"
  ON invoice_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()
  ));

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text DEFAULT '',
  company_email text DEFAULT '',
  company_phone text DEFAULT '',
  company_address text DEFAULT '',
  tax_rate decimal(5,2) DEFAULT 0,
  currency text DEFAULT 'EUR',
  invoice_prefix text DEFAULT 'INV',
  sale_prefix text DEFAULT 'SAL',
  purchase_prefix text DEFAULT 'PUR',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_user_id ON stock_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);