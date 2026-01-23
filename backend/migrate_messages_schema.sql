-- Migration script to update from old schema to new schema
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns to existing table
ALTER TABLE teacher_parent_messages 
ADD COLUMN IF NOT EXISTS sender_id UUID,
ADD COLUMN IF NOT EXISTS receiver_id UUID,
ADD COLUMN IF NOT EXISTS direction VARCHAR(20);

-- Step 2: Migrate existing data (if any exists)
-- Update teacher_to_parent messages
UPDATE teacher_parent_messages 
SET 
    sender_id = teacher_id,
    receiver_id = parent_id,
    direction = 'teacher_to_parent'
WHERE sender_id IS NULL AND teacher_id IS NOT NULL;

-- Step 3: Add constraints to new columns
ALTER TABLE teacher_parent_messages 
ALTER COLUMN sender_id SET NOT NULL;

ALTER TABLE teacher_parent_messages 
ALTER COLUMN receiver_id SET NOT NULL;

ALTER TABLE teacher_parent_messages 
ALTER COLUMN direction SET NOT NULL;

-- Step 4: Add check constraint for direction
ALTER TABLE teacher_parent_messages 
ADD CONSTRAINT check_direction 
CHECK (direction IN ('teacher_to_parent', 'parent_to_teacher'));

-- Step 5: Add foreign key constraints
ALTER TABLE teacher_parent_messages 
ADD CONSTRAINT fk_sender 
FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE teacher_parent_messages 
ADD CONSTRAINT fk_receiver 
FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 6: Update indexes
DROP INDEX IF EXISTS idx_messages_teacher;
DROP INDEX IF EXISTS idx_messages_parent;

CREATE INDEX IF NOT EXISTS idx_messages_sender ON teacher_parent_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON teacher_parent_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_direction ON teacher_parent_messages(direction);

-- Step 7: Update RLS policies
DROP POLICY IF EXISTS "Teachers can view own sent messages" ON teacher_parent_messages;
DROP POLICY IF EXISTS "Teachers can send messages" ON teacher_parent_messages;
DROP POLICY IF EXISTS "Parents can view received messages" ON teacher_parent_messages;
DROP POLICY IF EXISTS "Parents can mark messages as read" ON teacher_parent_messages;

-- New policies for updated schema
CREATE POLICY "Users can view own messages" ON teacher_parent_messages
    FOR SELECT USING (
        auth.uid() = sender_id OR
        auth.uid() = receiver_id OR
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    );

CREATE POLICY "Users can send messages" ON teacher_parent_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark messages as read" ON teacher_parent_messages
    FOR UPDATE USING (auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = receiver_id);

-- Step 8: Drop old columns (only after verifying migration worked)
-- Uncomment these lines after confirming the migration worked:
-- ALTER TABLE teacher_parent_messages DROP COLUMN IF EXISTS teacher_id;
-- ALTER TABLE teacher_parent_messages DROP COLUMN IF EXISTS parent_id;

-- Step 9: Update view
DROP VIEW IF EXISTS message_details;

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

-- Verify migration
SELECT 
    'Migration completed' as status,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN direction = 'teacher_to_parent' THEN 1 END) as teacher_to_parent,
    COUNT(CASE WHEN direction = 'parent_to_teacher' THEN 1 END) as parent_to_teacher
FROM teacher_parent_messages;