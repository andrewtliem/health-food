-- Eden Healthy Market - Cloudflare D1 Database Schema

DROP TABLE IF EXISTS product_dietary_tags;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS dietary_tags;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  description TEXT
);

CREATE TABLE dietary_tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  badge_color TEXT NOT NULL
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  price INTEGER NOT NULL, -- Stored in IDR (Rupiah)
  unit TEXT NOT NULL, -- e.g., '1kg', '500g', '1L', 'Pack'
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  origin TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  allergens TEXT,
  nutritional_highlights TEXT,
  is_featured INTEGER DEFAULT 0,
  is_bundle INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_dietary_tags (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES dietary_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  fulfillment_type TEXT NOT NULL, -- 'pickup' | 'delivery'
  pickup_time_slot TEXT,
  delivery_address TEXT,
  delivery_notes TEXT,
  items_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL, -- 'qris', 'gopay', 'bca_va', 'mandiri_va', 'credit_card'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'settlement', 'expire', 'cancel'
  midtrans_transaction_id TEXT,
  order_status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'ready_for_pickup', 'out_for_delivery', 'completed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
