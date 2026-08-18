-- Supabase Schema for Campus QR Subject Portal

-- Create subjects table
CREATE TABLE subjects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  semester integer DEFAULT 1,
  is_optional boolean DEFAULT false,
  branch text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create drive_links table
CREATE TABLE drive_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  division text NOT NULL,
  url text NOT NULL,
  teacher_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
  -- UNIQUE(subject_id, division) -- Removed to allow multiple teachers per subject in First Year
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
  ('55555555-5555-5555-5555-555555555555', 'Basic Electrical & Electronics Engineering (BEEE)', 'Introduction to Electrical Systems', 1, false),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Workshop', 'Workshop for Semester 1', 1, false);

-- Insert Semester 2 Subjects
INSERT INTO subjects (id, name, description, semester, is_optional) VALUES 
  ('66666666-6666-6666-6666-666666666666', 'Engineering Mathematics 2', 'Core Mathematics for Semester 2', 2, false),
  ('77777777-7777-7777-7777-777777777777', 'Engineering Physics 2', 'Core Physics for Semester 2', 2, false),
  ('88888888-8888-8888-8888-888888888888', 'Engineering Chemistry 2', 'Core Chemistry for Semester 2', 2, false),
  ('99999999-9999-9999-9999-999999999999', 'Engineering Graphics', 'Graphics for Semester 2', 2, false),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Workshop', 'Workshop for Semester 2', 2, false);

-- Insert Optional Subjects (Shows if details are filled for a division)
INSERT INTO subjects (id, name, description, semester, is_optional) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Optional Subject 1', 'Extra subject option 1', 2, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Optional Subject 2', 'Extra subject option 2', 2, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Optional Subject 3', 'Extra subject option 3', 2, true);

-- You can add drive links through the Admin Panel once the app is running!

-- Migration for SE Branches (Run this manually in Supabase SQL Editor if updating an existing DB)
-- ALTER TABLE subjects ADD COLUMN branch text;

-- Insert SE Subjects (Semester 3)
INSERT INTO subjects (name, description, semester, branch, is_optional) VALUES
  -- AIML Sem 3
  ('Engineering Mathematics 3 (EM-3)', 'Core Math for AIML', 3, 'AIML', false),
  ('Discrete Structures and Graph Theory (DSGT)', 'Core AIML', 3, 'AIML', false),
  ('Analysis Of Algorithm (AOA)', 'Core AIML', 3, 'AIML', false),
  ('Computer Organization & Architecture (COA)', 'Core AIML', 3, 'AIML', false),
  ('Open Elective', 'Elective for AIML', 3, 'AIML', true),
  ('Full Stack Java Programming (FSJP)', 'Core AIML', 3, 'AIML', false),
  ('Enterpreneurship Development (ED)', 'Core AIML', 3, 'AIML', false),
  ('Environmental Sci For Engineers (ESE)', 'Core AIML', 3, 'AIML', false),

  -- CHEM Sem 3
  ('Chemical engineering Mathematics (CEM)', 'Core Math for CHEM', 3, 'CHEM', false),
  ('Chem Engineering Therodynamics - 1', 'Core CHEM', 3, 'CHEM', false),
  ('Fluid Flow Operations (FFO)', 'Core CHEM', 3, 'CHEM', false),
  ('Process Calculation (PC)', 'Core CHEM', 3, 'CHEM', false),
  ('Environmental Sci For Engineers (ESE)', 'Core CHEM', 3, 'CHEM', false),
  ('Open Elective Course (OEC)', 'Elective for CHEM', 3, 'CHEM', true),
  ('Enterpreneurship Development (ED)', 'Core CHEM', 3, 'CHEM', false),

  -- EXTC Sem 3
  ('Mathematics for Signal Analysis', 'Core Math for EXTC', 3, 'EXTC', false),
  ('Network Theory & Control System', 'Core EXTC', 3, 'EXTC', false),
  ('C ++ & Java PRogramming', 'Core EXTC', 3, 'EXTC', false),
  ('Electronics Devices & LInear Circuits', 'Core EXTC', 3, 'EXTC', false),
  ('Digital System Design', 'Core EXTC', 3, 'EXTC', false),
  ('Open Elective', 'Elective for EXTC', 3, 'EXTC', true),
  ('Enterpreneurship Development', 'Core EXTC', 3, 'EXTC', false),
  ('Environmental Science', 'Core EXTC', 3, 'EXTC', false),

  -- COMP Sem 3
  ('Mathematics For Computer Engineering (MCE)', 'Core Math for COMP', 3, 'COMP', false),
  ('Discrete Structures and Graph Theory (DSGT)v', 'Core COMP', 3, 'COMP', false),
  ('Analysis Of Algorithm (AOA)', 'Core COMP', 3, 'COMP', false),
  ('Computer Organization & Architecture (COA)', 'Core COMP', 3, 'COMP', false),
  ('Open Elective', 'Elective for COMP', 3, 'COMP', true),
  ('Full Stack Java Programming (FSJP)', 'Core COMP', 3, 'COMP', false),
  ('Enterpreneurship Development (ED)', 'Core COMP', 3, 'COMP', false),
  ('Environmental Sci For Engineers (ESE)', 'Core COMP', 3, 'COMP', false),

  -- MECHANICAL Sem 3
  ('Enterpreneurship Development (ED)', 'Core MECH', 3, 'MECHANICAL', false),
  ('Engineering Mathematics - 3 (EM-3)', 'Core Math for MECH', 3, 'MECHANICAL', false),
  ('Thermodynamics (TD)', 'Core MECH', 3, 'MECHANICAL', false),
  ('Strength Of Materials (SOM)', 'Core MECH', 3, 'MECHANICAL', false),
  ('Environmental Sci For Engineers (ESE)', 'Core MECH', 3, 'MECHANICAL', false),
  ('Material Science (MS)', 'Core MECH', 3, 'MECHANICAL', false),

  -- CIVIL Sem 3
  ('Applied Mathematics for Civil Engg (AMCE)', 'Core Math for CIVIL', 3, 'CIVIL', false),
  ('Fluid Mechanics (FM)', 'Core CIVIL', 3, 'CIVIL', false),
  ('Building Materials & Concrete Technology (BMCT)', 'Core CIVIL', 3, 'CIVIL', false),
  ('Mechanics Of Structure (MOS)', 'Core CIVIL', 3, 'CIVIL', false),
  ('Open Elective', 'Elective for CIVIL', 3, 'CIVIL', true),
  ('Enterpreneurship Development (ED)', 'Core CIVIL', 3, 'CIVIL', false),
  ('Environmental Science (ES)', 'Core CIVIL', 3, 'CIVIL', false);

-- Insert SE Subjects (Semester 4 Placeholders)
INSERT INTO subjects (name, description, semester, branch, is_optional) VALUES
  ('Sem 4 Subject Placeholder', 'Placeholder for Sem 4', 4, 'AIML', false),
  ('Sem 4 Subject Placeholder', 'Placeholder for Sem 4', 4, 'CHEM', false),
  ('Sem 4 Subject Placeholder', 'Placeholder for Sem 4', 4, 'EXTC', false),
  ('Sem 4 Subject Placeholder', 'Placeholder for Sem 4', 4, 'COMP', false),
  ('Sem 4 Subject Placeholder', 'Placeholder for Sem 4', 4, 'MECHANICAL', false),
  ('Sem 4 Subject Placeholder', 'Placeholder for Sem 4', 4, 'CIVIL', false);
