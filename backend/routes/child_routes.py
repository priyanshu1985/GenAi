#!/usr/bin/env python3
"""
Enhanced child and progress endpoints for the dashboard
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Dict, Optional
from pydantic import BaseModel
from AI.profiles import CHILD_PROFILES, get_child_profile
from services.supabase_service import supabase
import uuid

router = APIRouter(prefix="/children", tags=["Children"])

class ChildProgress(BaseModel):
    child_id: str
    name: str
    age: int
    preferred_language: str
    learning_level: str
    weak_areas: List[str]
    strong_areas: List[str]
    progress: Dict[str, int]
    sessions_completed: int
    recent_activities: List[Dict]
    achievements: List[Dict]

class RecentActivity(BaseModel):
    id: int
    activity: str
    category: str
    time: str
    score: str
    emoji: str

@router.get("/")
async def get_children():
    """Get all available children"""
    try:
        children = []
        for child_id, profile in CHILD_PROFILES.items():
            children.append({
                "child_id": child_id,
                "name": profile.name,
                "age": profile.age,
                "preferred_language": profile.preferred_language,
                "learning_level": profile.learning_level,
                "avatar": profile.name[0].upper(),
                "level": min(profile.sessions_completed // 5, 10),  # Level based on sessions
                "xp": profile.sessions_completed * 25,  # XP based on sessions
                "progress": profile.progress,
                "sessions_completed": profile.sessions_completed
            })
        
        return {"success": True, "children": children}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get children: {str(e)}")

@router.get("/{child_id}")
async def get_child_details(child_id: str):
    """Get detailed information for a specific child"""
    try:
        profile = get_child_profile(child_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Child not found")
        
        # Generate recent activities based on progress
        recent_activities = generate_recent_activities(profile)
        
        # Generate achievements based on progress
        achievements = generate_achievements(profile)
        
        child_data = {
            "child_id": child_id,
            "name": profile.name,
            "age": profile.age,
            "preferred_language": profile.preferred_language,
            "learning_level": profile.learning_level,
            "weak_areas": profile.weak_areas,
            "strong_areas": profile.strong_areas,
            "progress": profile.progress,
            "sessions_completed": profile.sessions_completed,
            "avatar": profile.name[0].upper(),
            "level": min(profile.sessions_completed // 5, 10),
            "xp": profile.sessions_completed * 25,
            "streak": min(profile.sessions_completed // 3, 15),  # Streak calculation
            "lastActive": "Today, 3:30 PM",  # Mock for now
            "totalTimeToday": f"{min(profile.sessions_completed * 5, 60)} mins",
            "totalTimeWeek": f"{min(profile.sessions_completed * 0.5, 10)} hours",
            "recent_activities": recent_activities,
            "achievements": achievements
        }
        
        return {"success": True, "child": child_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get child details: {str(e)}")

def generate_recent_activities(profile):
    """Generate realistic recent activities based on child's progress"""
    activities = []
    activity_id = 1
    
    for topic, progress in profile.progress.items():
        if progress > 0:
            activity = {
                "id": activity_id,
                "activity": f"Practicing {topic.replace('_', ' ').title()}",
                "category": topic.replace('_', ' ').title(),
                "time": f"Today, {2 + activity_id}:00 PM",
                "score": f"{min(progress//20, 5)}/5",
                "emoji": get_topic_emoji(topic)
            }
            activities.append(activity)
            activity_id += 1
    
    # Limit to 5 most recent
    return activities[:5]

def generate_achievements(profile):
    """Generate achievements based on child's progress"""
    achievements = []
    achievement_id = 1
    
    # Progress-based achievements
    for topic, progress in profile.progress.items():
        if progress >= 50:
            achievements.append({
                "id": achievement_id,
                "title": f"{topic.replace('_', ' ').title()} Expert",
                "emoji": get_topic_emoji(topic),
                "earned": True
            })
            achievement_id += 1
    
    # Session-based achievements
    if profile.sessions_completed >= 5:
        achievements.append({
            "id": achievement_id,
            "title": "5 Day Streak",
            "emoji": "🔥",
            "earned": True
        })
        achievement_id += 1
    
    if profile.sessions_completed >= 20:
        achievements.append({
            "id": achievement_id,
            "title": "Learning Champion",
            "emoji": "🏆",
            "earned": True
        })
        achievement_id += 1
    
    # Add some unearned achievements
    achievements.extend([
        {"id": achievement_id, "title": "Video Watcher", "emoji": "📺", "earned": False},
        {"id": achievement_id + 1, "title": "Story Master", "emoji": "📚", "earned": False}
    ])
    
    return achievements

def get_topic_emoji(topic):
    """Get emoji for different topics"""
    emoji_map = {
        "colors": "🎨",
        "numbers": "🔢", 
        "shapes": "🔺",
        "animals": "🐾",
        "rhymes": "🎵",
        "letters": "🔤",
        "words": "📖",
        "hindi_words": "🇮🇳",
        "english_words": "🇺🇸",
        "music": "🎼"
    }
    return emoji_map.get(topic, "📚")