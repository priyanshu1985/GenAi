from config import supabase

def get_books():
    return supabase.table("books").select("*").execute().data

def get_videos():
    return supabase.table("videos").select("*").execute().data
