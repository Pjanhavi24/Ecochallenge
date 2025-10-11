-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  submission_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID REFERENCES challenges(challenge_id),
  assignment_id INTEGER,
  description TEXT,
  image_url TEXT,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by INTEGER,
  notes TEXT,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

-- Allow authenticated users to insert submissions
CREATE POLICY "Authenticated users can insert submissions" ON submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');