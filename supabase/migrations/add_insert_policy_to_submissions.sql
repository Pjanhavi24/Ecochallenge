-- Add insert policy for submissions
CREATE POLICY "Authenticated users can insert submissions" ON submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');