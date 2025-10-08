-- Add notes column to submissions table if it doesn't exist
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS notes TEXT;