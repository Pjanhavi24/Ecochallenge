"ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;" 
"-- Add RLS policy for users to update their own profile" 
"CREATE POLICY IF NOT EXISTS \"Users can update their own profile\" ON users FOR UPDATE USING (auth.uid()::text = user_id);" 
