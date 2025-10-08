-- Create password_reset_tokens table in Supabase
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to users table (using user_id field)
ALTER TABLE password_reset_tokens 
ADD CONSTRAINT fk_password_reset_tokens_user_id 
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage reset tokens (for API operations)
CREATE POLICY "Service role can manage reset tokens" ON password_reset_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow users to read their own reset tokens
CREATE POLICY "Users can read their own reset tokens" ON password_reset_tokens
  FOR SELECT USING (auth.uid()::text = user_id);
