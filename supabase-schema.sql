-- Supabase Schema for Campus QR Subject Portal

-- Create subjects table
CREATE TABLE subjects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  semester integer DEFAULT 1,
  is_optional boolean DEFAULT false,
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

-- Insert initial First Year Subjects (Semester 1)
INSERT INTO subjects (id, name, description, semester, is_optional) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Applied Mathematics 1 (AM-1)', 'Core Mathematics for First Year Engineering', 1, false),
  ('22222222-2222-2222-2222-222222222222', 'Applied Physics 1 (AP-1)', 'Core Physics for First Year Engineering', 1, false),
  ('33333333-3333-3333-3333-333333333333', 'Applied Chemistry', 'Core Chemistry for First Year Engineering', 1, false),
  ('44444444-4444-4444-4444-444444444444', 'Engineering Mechanics (EM)', 'Fundamental Mechanics for First Year', 1, false),
  ('55555555-5555-5555-5555-555555555555', 'Basic Electrical & Electronics Engineering (BEEE)', 'Introduction to Electrical Systems', 1, false);

-- Insert Semester 2 Subjects
INSERT INTO subjects (id, name, description, semester, is_optional) VALUES 
  ('66666666-6666-6666-6666-666666666666', 'Engineering Mathematics 2', 'Core Mathematics for Semester 2', 2, false),
  ('77777777-7777-7777-7777-777777777777', 'Engineering Physics 2', 'Core Physics for Semester 2', 2, false),
  ('88888888-8888-8888-8888-888888888888', 'Engineering Chemistry 2', 'Core Chemistry for Semester 2', 2, false),
  ('99999999-9999-9999-9999-999999999999', 'Engineering Graphics', 'Graphics for Semester 2', 2, false);

-- Insert Optional Subjects (Shows if details are filled for a division)
INSERT INTO subjects (id, name, description, semester, is_optional) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Optional Subject 1', 'Extra subject option 1', 2, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Optional Subject 2', 'Extra subject option 2', 2, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Optional Subject 3', 'Extra subject option 3', 2, true);

-- You can add drive links through the Admin Panel once the app is running!
