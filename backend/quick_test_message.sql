-- Quick test: Insert a demo message in Supabase SQL Editor
-- Replace the UUIDs with actual user IDs from your users table

-- First, check your users table to get real IDs:
SELECT id, email, role FROM users WHERE role IN ('teacher', 'parent') LIMIT 5;

-- Then insert a test message (replace the UUIDs below):
INSERT INTO teacher_parent_messages (teacher_id, parent_id, message, message_type, is_read) 
VALUES 
    (
        'YOUR_TEACHER_UUID_HERE', 
        'YOUR_PARENT_UUID_HERE', 
        'Test message: Your child is doing great with alphabets! Keep up the good work.', 
        'progress', 
        false
    );

-- Verify the message was created:
SELECT * FROM teacher_parent_messages ORDER BY created_at DESC LIMIT 5;