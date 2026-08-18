-- Run this in your Supabase SQL Editor

-- 1. Create the daily views tracking table
CREATE TABLE IF NOT EXISTS daily_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  view_date date DEFAULT CURRENT_DATE,
  view_count integer DEFAULT 0,
  UNIQUE(subject_id, view_date)
);

-- 2. Update the RPC function to increment both the all-time total and the daily total
CREATE OR REPLACE FUNCTION increment_subject_view(subject_id_param uuid)
RETURNS void AS $$
BEGIN
  -- Increment all-time views
  UPDATE subjects
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = subject_id_param;

  -- Increment daily views (insert if doesn't exist for today, else update)
  INSERT INTO daily_views (subject_id, view_date, view_count)
  VALUES (subject_id_param, CURRENT_DATE, 1)
  ON CONFLICT (subject_id, view_date) 
  DO UPDATE SET view_count = daily_views.view_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Insert some fake dummy data for the last 7 days so you can see the chart working immediately!
DO $$
DECLARE
  sub_id uuid;
  i int;
  fake_date date;
  random_views int;
BEGIN
  -- Get the first subject's ID to attach fake data to
  SELECT id INTO sub_id FROM subjects LIMIT 1;
  
  IF sub_id IS NOT NULL THEN
    -- Loop through the last 7 days
    FOR i IN 0..6 LOOP
      fake_date := CURRENT_DATE - i;
      -- Generate random views between 10 and 150
      random_views := floor(random() * 140 + 10)::int;
      
      INSERT INTO daily_views (subject_id, view_date, view_count)
      VALUES (sub_id, fake_date, random_views)
      ON CONFLICT (subject_id, view_date) DO NOTHING;
    END LOOP;
  END IF;
END $$;
