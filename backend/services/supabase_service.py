from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Warning: Could not initialize Supabase client: {e}")
    supabase = None