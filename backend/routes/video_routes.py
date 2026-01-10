"""
Video Routes - API endpoints for curated educational videos
Fetches teacher-approved videos from Supabase for safe child viewing
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
from supabase import create_client, Client
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SUPABASE_URL, SUPABASE_KEY

router = APIRouter(tags=["Videos"])

# Initialize Supabase client
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# ============================================================
# Pydantic Models for Request/Response
# ============================================================

class VideoResponse(BaseModel):
    """Response model for a single video"""
    id: int
    videoId: str  # YouTube video ID
    title: str
    description: Optional[str] = None
    category: str
    language: str = "en"
    minAge: int = 2
    maxAge: int = 7
    thumbnailUrl: str


class VideoListResponse(BaseModel):
    """Response model for video list"""
    videos: List[VideoResponse]
    total: int
    category: Optional[str] = None


# ============================================================
# Helper Functions
# ============================================================

def format_video(row: dict) -> dict:
    """Format database row to API response format"""
    return {
        "id": row["id"],
        "videoId": row["video_id"],
        "title": row["title"],
        "description": row.get("description"),
        "category": row["category"],
        "language": row.get("language", "en"),
        "minAge": row.get("min_age", 2),
        "maxAge": row.get("max_age", 7),
        "thumbnailUrl": f"https://img.youtube.com/vi/{row['video_id']}/mqdefault.jpg"
    }


# ============================================================
# API Endpoints
# ============================================================

@router.get("/videos", response_model=VideoListResponse)
async def get_approved_videos(
    category: Optional[str] = Query(None, description="Filter by category"),
    language: Optional[str] = Query(None, description="Filter by language (en, hi, te, mr)"),
    limit: int = Query(50, ge=1, le=100, description="Maximum videos to return")
):
    """
    Get all approved educational videos.

    - Only returns videos marked as approved by teachers
    - Can filter by category and language
    - Safe for children (2-7 years)
    """
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail="Database connection not available"
        )

    try:
        # Build query for approved videos only
        query = supabase.table("approved_videos").select("*").eq("is_approved", True)

        # Apply filters
        if category:
            query = query.eq("category", category)
        if language:
            query = query.eq("language", language)

        # Execute query with limit
        response = query.limit(limit).execute()

        if response.data:
            videos = [format_video(row) for row in response.data]
            return {
                "videos": videos,
                "total": len(videos),
                "category": category
            }

        return {"videos": [], "total": 0, "category": category}

    except Exception as e:
        print(f"Error fetching videos: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch videos: {str(e)}"
        )


@router.get("/videos/categories")
async def get_video_categories():
    """
    Get all available video categories.

    Returns unique categories from approved videos.
    """
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail="Database connection not available"
        )

    try:
        response = supabase.table("approved_videos")\
            .select("category")\
            .eq("is_approved", True)\
            .execute()

        if response.data:
            # Get unique categories
            categories = list(set(row["category"] for row in response.data))
            categories.sort()
            return {"categories": categories}

        return {"categories": []}

    except Exception as e:
        print(f"Error fetching categories: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch categories: {str(e)}"
        )


@router.get("/videos/{video_id}")
async def get_video_by_id(video_id: int):
    """
    Get a specific video by its database ID.

    Only returns if video is approved.
    """
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail="Database connection not available"
        )

    try:
        response = supabase.table("approved_videos")\
            .select("*")\
            .eq("id", video_id)\
            .eq("is_approved", True)\
            .single()\
            .execute()

        if response.data:
            return format_video(response.data)

        raise HTTPException(status_code=404, detail="Video not found")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching video: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch video: {str(e)}"
        )


@router.get("/videos/youtube/{youtube_id}")
async def get_video_by_youtube_id(youtube_id: str):
    """
    Get a specific video by its YouTube video ID.

    Only returns if video is approved.
    """
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail="Database connection not available"
        )

    try:
        response = supabase.table("approved_videos")\
            .select("*")\
            .eq("video_id", youtube_id)\
            .eq("is_approved", True)\
            .single()\
            .execute()

        if response.data:
            return format_video(response.data)

        raise HTTPException(status_code=404, detail="Video not found or not approved")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching video: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch video: {str(e)}"
        )
