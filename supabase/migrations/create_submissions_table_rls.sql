-- Create submissions table RLS policies
-- Enable RLS if not already enabled
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Service role can manage submissions" ON submissions;
DROP POLICY IF EXISTS "Students can insert their own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can read their own submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can read submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can update submissions" ON submissions;

-- Create policy to allow service role to manage submissions (for API operations)
CREATE POLICY "Service role can manage submissions" ON submissions
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow students to insert their own submissions
CREATE POLICY "Students can insert their own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid()::text = student_id);

-- Create policy to allow students to read their own submissions
CREATE POLICY "Students can read their own submissions" ON submissions
  FOR SELECT USING (auth.uid()::text = student_id);

-- Create policy to allow authenticated users to read submissions (for teachers to review)
-- Assuming teachers are authenticated users; we can refine this later
CREATE POLICY "Authenticated users can read submissions" ON submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update submissions (for teachers to review)
-- This allows updating status, notes, etc.
CREATE POLICY "Authenticated users can update submissions" ON submissions
  FOR UPDATE USING (auth.role() = 'authenticated');