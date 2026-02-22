-- =============================================
-- Rencanakan Hari Baikmu — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT CHECK (role IN ('CPP', 'CPW')) DEFAULT 'CPP',
  mode TEXT CHECK (mode IN ('all-in-one', 'checklist', 'budget')) DEFAULT 'all-in-one',
  partner_id UUID REFERENCES profiles(id),
  wedding_date DATE DEFAULT '2025-12-20',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks / Checklist
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Pernikahan',
  status TEXT CHECK (status IN ('todo', 'in-progress', 'done')) DEFAULT 'todo',
  pic TEXT DEFAULT 'CPP',
  due_date DATE,
  contact_person TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Budget categories
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  allocated BIGINT DEFAULT 0,
  color TEXT DEFAULT '#B76E79',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own categories" ON budget_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON budget_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON budget_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON budget_categories FOR DELETE USING (auth.uid() = user_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount BIGINT NOT NULL,
  type TEXT CHECK (type IN ('dp', 'cicilan', 'pelunasan')) DEFAULT 'dp',
  note TEXT,
  paid_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payments" ON payments FOR DELETE USING (auth.uid() = user_id);

-- Vendors (global, readable by all authenticated users)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  price_range TEXT,
  image_url TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view vendors" ON vendors FOR SELECT USING (auth.role() = 'authenticated');

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view reviews" ON reviews FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Seed vendor data
-- =============================================
INSERT INTO vendors (name, category, location, rating, review_count, price_range, image_url, whatsapp) VALUES
  ('Griya Persada Venue', 'Venue', 'Jakarta Selatan', 4.8, 124, 'Rp 30jt - 50jt', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', '6281234567890'),
  ('Rasa Nusantara Catering', 'Catering', 'Jakarta Timur', 4.9, 210, 'Mulai Rp 150k/pax', 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', '6289876543210'),
  ('Estetika Studio', 'Dokumentasi', 'Tangerang', 4.7, 89, 'Rp 8jt - 15jt', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', '628111222333'),
  ('Ayu MUA Jakarta', 'MUA', 'Jakarta Barat', 5.0, 156, 'Rp 5jt - 10jt', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', '628555666777'),
  ('Blooming Decor', 'Dekorasi', 'Bandung', 4.6, 78, 'Rp 15jt - 30jt', 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80', '628999888777'),
  ('MC Reza Entertainment', 'MC/Band', 'Jakarta Pusat', 4.9, 195, 'Rp 5jt - 12jt', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80', '628333444555');
