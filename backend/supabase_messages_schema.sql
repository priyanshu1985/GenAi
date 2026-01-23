-- ============================================================
-- Supabase Schema for Teacher-Parent Two-Way Messaging System
-- Teacher -> Parent: Updates, Homework, Progress
-- Parent -> Teacher: Complaints, Doubts, Questions
-- Run these commands in your Supabase SQL editor
-- ============================================================

-- Drop existing table if you want to start fresh (optional)
-- DROP TABLE IF EXISTS teacher_parent_messages;

-- Create messages table (supports both directions)
CREATE TABLE IF NOT EXISTS teacher_parent_messages (
    id BIGSERIAL PRIMARY KEY,

    -- Sender and receiver (flexible for both directions)
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Direction indicator
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('teacher_to_parent', 'parent_to_teacher')),

    -- Optional: Link to specific child
    child_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Message content
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'general' CHECK (message_type IN (
        'general',       -- General message
        'homework',      -- Homework assignment
        'announcement',  -- Announcement
        'progress',      -- Progress update
        'reminder',      -- Reminder
        'complaint',     -- Parent complaint
        'doubt',         -- Parent doubt/question
        'feedback'       -- Parent feedback
    )),

    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender ON teacher_parent_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON teacher_parent_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON teacher_parent_messages(direction);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON teacher_parent_messages(receiver_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_messages_created ON teacher_parent_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE teacher_parent_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON teacher_parent_messages
    FOR SELECT USING (
        auth.uid() = sender_id OR
        auth.uid() = receiver_id OR
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

-- Policy: Users can send messages
CREATE POLICY "Users can send messages" ON teacher_parent_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policy: Receivers can mark messages as read
CREATE POLICY "Receivers can mark messages as read" ON teacher_parent_messages
    FOR UPDATE USING (auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = receiver_id);

-- Trigger to update updated_at timestamp
-- First create the function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON teacher_parent_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- View for easy message listing with user info
-- ============================================================

CREATE OR REPLACE VIEW message_details AS
SELECT
    m.id,
    m.sender_id,
    m.receiver_id,
    m.direction,
    m.child_id,
    m.message,
    m.message_type,
    m.is_read,
    m.read_at,
    m.created_at,
    s.name as sender_name,
    s.email as sender_email,
    s.role as sender_role,
    r.name as receiver_name,
    r.email as receiver_email,
    r.role as receiver_role
FROM teacher_parent_messages m
LEFT JOIN users s ON m.sender_id = s.id
LEFT JOIN users r ON m.receiver_id = r.id
ORDER BY m.created_at DESC;

-- ============================================================
-- MIGRATION: If you have existing data with old schema
-- ============================================================
/*
-- Run this if you need to migrate from old schema to new:
ALTER TABLE teacher_parent_messages
ADD COLUMN IF NOT EXISTS sender_id UUID,
ADD COLUMN IF NOT EXISTS receiver_id UUID,
ADD COLUMN IF NOT EXISTS direction VARCHAR(20);

-- Migrate existing data
UPDATE teacher_parent_messages
SET sender_id = teacher_id,
    receiver_id = parent_id,
    direction = 'teacher_to_parent'
WHERE sender_id IS NULL;

-- Then drop old columns
ALTER TABLE teacher_parent_messages
DROP COLUMN IF EXISTS teacher_id,
DROP COLUMN IF EXISTS parent_id;
*/
