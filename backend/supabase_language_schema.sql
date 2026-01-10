-- Supabase Schema Changes for Multi-Language Support
-- Run these commands in your Supabase SQL editor

-- Add language column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'hi';

-- Add comment to the column
COMMENT ON COLUMN users.language IS 'User preferred language (hi=Hindi, en=English, te=Telugu)';

-- Create index for better performance on language queries
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language);

-- Update existing users to have default language if NULL
UPDATE users 
SET language = 'hi' 
WHERE language IS NULL;

-- Add constraint to ensure only valid languages
ALTER TABLE users 
ADD CONSTRAINT check_language_valid 
CHECK (language IN ('hi', 'en', 'te'));

-- Optional: Create a language preferences table for more complex setups
CREATE TABLE IF NOT EXISTS user_language_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('hi', 'en', 'te')),
    ui_language VARCHAR(5) DEFAULT 'hi' CHECK (ui_language IN ('hi', 'en', 'te')),
    ai_response_language VARCHAR(5) DEFAULT 'hi' CHECK (ai_response_language IN ('hi', 'en', 'te')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add RLS (Row Level Security) policies for language preferences
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to view and edit their own language preferences
CREATE POLICY "Users can view own language preferences" ON user_language_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own language preferences" ON user_language_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own language preferences" ON user_language_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_language_preferences_updated_at
    BEFORE UPDATE ON user_language_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO user_language_preferences (user_id, language, ui_language, ai_response_language)
-- VALUES 
--   (auth.uid(), 'hi', 'hi', 'hi') -- Replace auth.uid() with actual user ID for testing

-- View to get user language info easily
CREATE OR REPLACE VIEW user_language_info AS
SELECT 
    u.id as user_id,
    u.email,
    COALESCE(u.language, 'hi') as default_language,
    COALESCE(ulp.language, u.language, 'hi') as preferred_language,
    COALESCE(ulp.ui_language, u.language, 'hi') as ui_language,
    COALESCE(ulp.ai_response_language, u.language, 'hi') as ai_response_language,
    ulp.updated_at as language_updated_at
FROM users u
LEFT JOIN user_language_preferences ulp ON u.id = ulp.user_id;