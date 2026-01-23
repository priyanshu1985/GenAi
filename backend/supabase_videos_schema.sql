-- ============================================================
-- Supabase Schema for Approved Educational Videos
-- Safe, curated video content for children (2-7 years)
-- Run these commands in your Supabase SQL editor
-- ============================================================

-- Create videos table for approved educational content
CREATE TABLE IF NOT EXISTS approved_videos (
    id BIGSERIAL PRIMARY KEY,

    -- YouTube video identifier (e.g., "ZanHgPprl-0")
    video_id VARCHAR(20) NOT NULL UNIQUE,

    -- Video metadata
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,

    -- Age range suitability (in years)
    min_age INTEGER DEFAULT 2 CHECK (min_age >= 0),
    max_age INTEGER DEFAULT 7 CHECK (max_age <= 18),

    -- Language of the video
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'hi', 'te', 'mr')),

    -- Approval tracking
    is_approved BOOLEAN DEFAULT TRUE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ DEFAULT NOW(),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_age_range CHECK (min_age <= max_age)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_approved_videos_category ON approved_videos(category);
CREATE INDEX IF NOT EXISTS idx_approved_videos_language ON approved_videos(language);
CREATE INDEX IF NOT EXISTS idx_approved_videos_approved ON approved_videos(is_approved);

-- Enable Row Level Security
ALTER TABLE approved_videos ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved videos
CREATE POLICY "Anyone can view approved videos" ON approved_videos
    FOR SELECT USING (is_approved = TRUE);

-- Policy: Only teachers/admins can insert videos
CREATE POLICY "Teachers and admins can add videos" ON approved_videos
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('teacher', 'admin', 'worker')
        )
    );

-- Policy: Only teachers/admins can update videos
CREATE POLICY "Teachers and admins can update videos" ON approved_videos
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('teacher', 'admin', 'worker')
        )
    );

-- Policy: Only admins can delete videos
CREATE POLICY "Only admins can delete videos" ON approved_videos
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_approved_videos_updated_at
    BEFORE UPDATE ON approved_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DEMO DATA: Curated educational videos for children (2-7 years)
-- Sources: Cocomelon, Sesame Street, ChuChu TV, Peekaboo Kidz, Super Simple
-- ============================================================

-- First, delete old demo data if exists
DELETE FROM approved_videos WHERE video_id IN (
    'ZanHgPprl-0', 'DR-cfDsHCGA', 'eCHE7sB6MzI', '8irSFvoyLHQ',
    'pWepfJ-8XU0', 'S7Qv0XKmK6g', 'qH7W4aNKH8Y', 'mXMofxtDPUQ'
);

-- Insert new curated videos (verified working video IDs)
INSERT INTO approved_videos (video_id, title, category, language, min_age, max_age) VALUES
    -- COCOMELON (Official Channel)
    ('lrAbrdqsKhU', 'Wheels on the Bus - Cocomelon', 'Rhymes', 'en', 2, 5),
    ('71hiByoZ_3M', 'Bath Song - Cocomelon', 'Rhymes', 'en', 2, 5),
    ('ystdFo3SwxQ', 'ABC Song - Cocomelon', 'Alphabets', 'en', 2, 5),
    ('0j6k_DVz7-o', '123 Song - Cocomelon', 'Numbers', 'en', 2, 5),
    -- CHUCHU TV
    ('hq3yfQnllfQ', 'Phonics Song with Two Words - ChuChu TV', 'Alphabets', 'en', 3, 7),
    ('HjXgLy-5lCE', 'Rain Rain Go Away - ChuChu TV', 'Rhymes', 'en', 2, 5),
    ('LFrKYjrIDs8', 'Johny Johny Yes Papa - ChuChu TV', 'Rhymes', 'en', 2, 5),
    ('ZC7yZ69lxMs', 'Learn Colors for Children - ChuChu TV', 'Colors', 'en', 2, 5),
    -- SUPER SIMPLE SONGS
    ('XqZsoesa55w', 'Baby Shark - Super Simple Songs', 'Rhymes', 'en', 2, 5),
    ('K6DSMZ8b3LE', 'Twinkle Twinkle Little Star - Super Simple', 'Rhymes', 'en', 2, 5),
    ('fe4fZoGS1V4', 'Head Shoulders Knees & Toes - Super Simple', 'Rhymes', 'en', 2, 5),
    -- PEEKABOO KIDZ (Dr. Binocs)
    ('RG4rFiG9PFs', 'Solar System - Dr. Binocs', 'Science', 'en', 4, 7),
    ('b6rkXGikuNA', 'Water Cycle - Dr. Binocs', 'Science', 'en', 4, 7),
    ('pMHsNRNuWLM', 'Digestive System - Dr. Binocs', 'Science', 'en', 4, 7),
    -- SESAME STREET
    ('lYIRO97dhII', 'Elmo''s Song - Sesame Street', 'Rhymes', 'en', 2, 6),
    ('8LGDQ4JrSgo', 'ABC Cookie Monster - Sesame Street', 'Alphabets', 'en', 3, 7),
    ('GElOFFz_pI0', 'Count with the Count - Sesame Street', 'Numbers', 'en', 3, 7)
ON CONFLICT (video_id) DO NOTHING;

-- ============================================================
-- Optional: Playlists table for organizing videos
-- ============================================================

CREATE TABLE IF NOT EXISTS video_playlists (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    thumbnail_video_id VARCHAR(20), -- First video as thumbnail
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for playlist-video relationship
CREATE TABLE IF NOT EXISTS playlist_videos (
    id BIGSERIAL PRIMARY KEY,
    playlist_id BIGINT REFERENCES video_playlists(id) ON DELETE CASCADE,
    video_id BIGINT REFERENCES approved_videos(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(playlist_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist ON playlist_videos(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_videos_position ON playlist_videos(playlist_id, position);

-- Enable RLS on playlist tables
ALTER TABLE video_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_videos ENABLE ROW LEVEL SECURITY;

-- Policies for playlists
CREATE POLICY "Anyone can view active playlists" ON video_playlists
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Teachers can manage playlists" ON video_playlists
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('teacher', 'admin', 'worker')
        )
    );

CREATE POLICY "Anyone can view playlist videos" ON playlist_videos
    FOR SELECT USING (TRUE);

CREATE POLICY "Teachers can manage playlist videos" ON playlist_videos
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('teacher', 'admin', 'worker')
        )
    );

-- ============================================================
-- View for easy video listing with all info
-- ============================================================

CREATE OR REPLACE VIEW video_catalog AS
SELECT
    v.id,
    v.video_id,
    v.title,
    v.description,
    v.category,
    v.language,
    v.min_age,
    v.max_age,
    v.is_approved,
    v.created_at,
    CONCAT('https://img.youtube.com/vi/', v.video_id, '/mqdefault.jpg') as thumbnail_url
FROM approved_videos v
WHERE v.is_approved = TRUE
ORDER BY v.category, v.title;
