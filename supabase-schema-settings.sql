-- Migration for Analytics and Global Announcements
-- Run this in your Supabase SQL Editor

-- 1. Add view count to subjects if it doesn't exist
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- 2. Create the Settings table for announcements
CREATE TABLE IF NOT EXISTS app_settings (
  id integer PRIMARY KEY,
  announcement_text text,
  is_active boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Insert the default row (ID 1)
INSERT INTO app_settings (id, announcement_text, is_active) 
VALUES (1, 'Welcome to EduScan!', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up RLS for app_settings
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on app_settings" 
  ON app_settings FOR SELECT 
  TO public USING (true);

-- 5. Create RPC function to safely increment subject views
CREATE OR REPLACE FUNCTION increment_subject_view(subject_id_param uuid)
RETURNS void AS $$
BEGIN
  UPDATE subjects
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = subject_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
