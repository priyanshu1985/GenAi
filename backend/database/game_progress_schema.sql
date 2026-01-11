-- Game Progress Table Schema for Supabase
-- Run this SQL in your Supabase dashboard to create the game_progress table

CREATE TABLE IF NOT EXISTS game_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    child_id TEXT NOT NULL UNIQUE,
    coins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    current_difficulty TEXT DEFAULT 'medium',
    consecutive_correct INTEGER DEFAULT 0,
    consecutive_wrong INTEGER DEFAULT 0,
    last_played TIMESTAMPTZ DEFAULT NOW(),
    badges_earned JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game_progress_updated_at 
    BEFORE UPDATE ON game_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

-- Sample insert for testing
INSERT INTO game_progress (child_id, coins, level) 
VALUES ('child_007', 25, 2) 
ON CONFLICT (child_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_progress_child_id ON game_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_coins ON game_progress(coins);
CREATE INDEX IF NOT EXISTS idx_game_progress_level ON game_progress(level);