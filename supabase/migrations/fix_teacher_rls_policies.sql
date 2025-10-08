-- Fix RLS policies for teachers table
-- Enable RLS if not already enabled
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Service role can manage teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can read their own profile" ON teachers;
DROP POLICY IF EXISTS "Users can read teacher profiles" ON teachers;

-- Create policy to allow service role to manage teacher records (for API operations)
CREATE POLICY "Service role can manage teachers" ON teachers
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow teachers to read their own profile
CREATE POLICY "Teachers can read their own profile" ON teachers
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create policy to allow authenticated users to read teacher profiles (for student-teacher interactions)
CREATE POLICY "Users can read teacher profiles" ON teachers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert their own teacher record
DROP POLICY IF EXISTS "Authenticated users can manage their own teacher record" ON teachers;
CREATE POLICY "Authenticated users can insert their own teacher record" ON teachers
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create policy to allow authenticated users to update their own teacher record
CREATE POLICY "Authenticated users can update their own teacher record" ON teachers
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create policy to allow authenticated users to delete their own teacher record
CREATE POLICY "Authenticated users can delete their own teacher record" ON teachers
  FOR DELETE USING (auth.uid()::text = user_id::text);