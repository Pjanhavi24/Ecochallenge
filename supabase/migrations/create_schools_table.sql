-- Create schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read schools
CREATE POLICY "Schools are viewable by everyone" ON schools
    FOR SELECT USING (true);

-- Create policy for admin to insert/update schools
-- Assuming admin role or a specific check
CREATE POLICY "Admins can insert schools" ON schools
    FOR INSERT WITH CHECK (true); -- Adjust based on your admin check

CREATE POLICY "Admins can update schools" ON schools
    FOR UPDATE USING (true);

-- Create index on name for faster searches
CREATE INDEX idx_schools_name ON schools (name);
CREATE INDEX idx_schools_city ON schools (city);
CREATE INDEX idx_schools_state ON schools (state);