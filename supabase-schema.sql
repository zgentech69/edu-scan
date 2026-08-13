-- Supabase Schema for Campus QR Subject Portal

-- Create subjects table
CREATE TABLE subjects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create drive_links table
CREATE TABLE drive_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  division text NOT NULL,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(subject_id, division)
);

-- Enable RLS (Row Level Security) but allow public read access
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on subjects" 
  ON subjects FOR SELECT 
  TO public USING (true);

CREATE POLICY "Allow public read access on drive_links" 
  ON drive_links FOR SELECT 
  TO public USING (true);

-- Insert initial First Year Subjects
INSERT INTO subjects (id, name, description) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Applied Mathematics 1 (AM-1)', 'Core Mathematics for First Year Engineering'),
  ('22222222-2222-2222-2222-222222222222', 'Applied Physics 1 (AP-1)', 'Core Physics for First Year Engineering'),
  ('33333333-3333-3333-3333-333333333333', 'Applied Chemistry', 'Core Chemistry for First Year Engineering'),
  ('44444444-4444-4444-4444-444444444444', 'Engineering Mechanics (EM)', 'Fundamental Mechanics for First Year'),
  ('55555555-5555-5555-5555-555555555555', 'Basic Electrical & Electronics Engineering (BEEE)', 'Introduction to Electrical Systems');

-- You can add drive links through the Admin Panel once the app is running!
