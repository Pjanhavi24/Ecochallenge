-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  challenge_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  points INTEGER NOT NULL,
  image_url TEXT,
  tutorial_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow service role to manage all challenges
CREATE POLICY "Service role can manage challenges" ON challenges
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read challenges
CREATE POLICY "Authenticated users can read challenges" ON challenges
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow teachers to create challenges (assuming teachers have a specific role or metadata)
-- For now, allow authenticated users to insert (we can refine this later)
CREATE POLICY "Authenticated users can create challenges" ON challenges
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow teachers to update their own challenges (if we add a teacher_id field later)
-- For now, allow authenticated users to update
CREATE POLICY "Authenticated users can update challenges" ON challenges
  FOR UPDATE USING (auth.role() = 'authenticated');