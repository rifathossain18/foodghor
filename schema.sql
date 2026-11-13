-- FoodGhor Cloudflare D1 Database Schema
-- Ready for Cloudflare D1 SQLite database binding (DB)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  address TEXT,
  city TEXT DEFAULT 'Inside Dhaka',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_orders INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  status TEXT DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bangla_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  regular_price REAL NOT NULL,
  unit TEXT NOT NULL,
  in_stock INTEGER DEFAULT 1,
  stock_count INTEGER DEFAULT 50,
  image TEXT NOT NULL,
  gallery_images TEXT, -- JSON array of image URLs
  short_description TEXT,
  landing_config TEXT -- JSON string of complete sales funnel settings
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_note TEXT,
  items TEXT NOT NULL, -- JSON array of order items
  subtotal REAL NOT NULL,
  delivery_charge REAL NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'Pending',
  courier_name TEXT DEFAULT 'Steadfast',
  tracking_code TEXT,
  tracking_history TEXT, -- JSON array of status history
  payment_method TEXT DEFAULT 'Cash on Delivery',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  avatar TEXT,
  image TEXT,
  verified INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Approved',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  tag TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  button_text TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
