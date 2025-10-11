-- Create school change requests table
CREATE TABLE IF NOT EXISTS school_change_requests (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    requested_class TEXT,
    requested_school TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE school_change_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own school change requests" ON school_change_requests
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can read their own school change requests" ON school_change_requests
    FOR SELECT USING (auth.uid()::text = user_id);

-- Allow admins to read and update all requests (assuming admin role exists)
CREATE POLICY "Admins can manage all school change requests" ON school_change_requests
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Index on user_id for performance
CREATE INDEX idx_school_change_requests_user_id ON school_change_requests (user_id);
CREATE INDEX idx_school_change_requests_status ON school_change_requests (status);
