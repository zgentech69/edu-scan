-- Create the hod_passwords table
CREATE TABLE hod_passwords (
  branch_id text PRIMARY KEY,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE hod_passwords ENABLE ROW LEVEL SECURITY;

-- DO NOT ADD ANY POLICIES FOR PUBLIC ACCESS.
-- By default, without policies, RLS denies all access to the table for authenticated and anon users.
-- Only the backend using the Service Role Key can bypass RLS to read and write to this table.
-- This ensures maximum security for passwords.
