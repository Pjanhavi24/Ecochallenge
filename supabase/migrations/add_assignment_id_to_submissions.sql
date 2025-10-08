-- Add assignment_id column to submissions table if it doesn't exist
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS assignment_id INTEGER;