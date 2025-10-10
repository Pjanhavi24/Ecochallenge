-- Create teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    school TEXT,
    subject TEXT,
    experience INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can read their own data" ON teachers
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Teachers can update their own data" ON teachers
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Teachers can insert their own data" ON teachers
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Index on user_id
CREATE INDEX idx_teachers_user_id ON teachers (user_id);