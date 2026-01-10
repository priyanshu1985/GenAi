"""
Child Profiles Module
Contains sample child profiles for personalization.
Each profile includes age, preferred language, learning level, weak areas, and progress.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass, field


@dataclass
class ChildProfile:
    """Data class representing a child's learning profile"""
    child_id: str
    name: str
    age: int
    preferred_language: str  # e.g., "hindi", "english", "tamil", "telugu"
    learning_level: str  # "beginner", "intermediate", "advanced"
    weak_areas: List[str] = field(default_factory=list)  # e.g., ["numbers", "colors", "shapes"]
    strong_areas: List[str] = field(default_factory=list)  # e.g., ["animals", "rhymes"]
    progress: Dict[str, int] = field(default_factory=dict)  # topic -> percentage
    sessions_completed: int = 0

    def to_dict(self) -> dict:
        """Convert profile to dictionary for JSON serialization"""
        return {
            "child_id": self.child_id,
            "name": self.name,
            "age": self.age,
            "preferred_language": self.preferred_language,
            "learning_level": self.learning_level,
            "weak_areas": self.weak_areas,
            "strong_areas": self.strong_areas,
            "progress": self.progress,
            "sessions_completed": self.sessions_completed
        }


# Sample child profiles database (in production, use Supabase)
CHILD_PROFILES: Dict[str, ChildProfile] = {
    "child_001": ChildProfile(
        child_id="child_001",
        name="Aarav",
        age=5,
        preferred_language="hindi",
        learning_level="beginner",
        weak_areas=["numbers", "shapes"],
        strong_areas=["colors", "animals"],
        progress={"colors": 80, "animals": 70, "numbers": 30, "shapes": 25},
        sessions_completed=12
    ),
    "child_002": ChildProfile(
        child_id="child_002",
        name="Priya",
        age=6,
        preferred_language="hindi",
        learning_level="intermediate",
        weak_areas=["english_words"],
        strong_areas=["numbers", "rhymes", "colors"],
        progress={"numbers": 85, "rhymes": 90, "colors": 95, "english_words": 40},
        sessions_completed=25
    ),
    "child_003": ChildProfile(
        child_id="child_003",
        name="Ravi",
        age=4,
        preferred_language="tamil",
        learning_level="beginner",
        weak_areas=["shapes", "colors"],
        strong_areas=["rhymes"],
        progress={"rhymes": 60, "shapes": 20, "colors": 35},
        sessions_completed=8
    ),
    "child_004": ChildProfile(
        child_id="child_004",
        name="Ananya",
        age=5,
        preferred_language="telugu",
        learning_level="beginner",
        weak_areas=["numbers"],
        strong_areas=["animals", "colors"],
        progress={"animals": 75, "colors": 70, "numbers": 25},
        sessions_completed=15
    ),
    "child_005": ChildProfile(
        child_id="child_005",
        name="Kiran",
        age=6,
        preferred_language="english",
        learning_level="intermediate",
        weak_areas=["hindi_words"],
        strong_areas=["numbers", "shapes", "colors"],
        progress={"numbers": 90, "shapes": 85, "colors": 95, "hindi_words": 30},
        sessions_completed=30
    ),
}


def get_child_profile(child_id: str) -> Optional[ChildProfile]:
    """
    Retrieve a child's profile by ID.
    Returns None if child not found.
    """
    return CHILD_PROFILES.get(child_id)


def get_profile_context(child_id: str) -> str:
    """
    Generate a context string from child profile for LLM prompting.
    This helps personalize the AI response.
    """
    profile = get_child_profile(child_id)

    if not profile:
        # Default context for unknown children
        return """
Child Profile: Unknown child (use default settings)
Age: Around 5 years old
Language: Hindi
Level: Beginner
Focus: General learning with simple explanations
"""

    # Build personalized context
    weak_areas_str = ", ".join(profile.weak_areas) if profile.weak_areas else "none identified"
    strong_areas_str = ", ".join(profile.strong_areas) if profile.strong_areas else "none identified"

    context = f"""
Child Profile:
- Name: {profile.name}
- Age: {profile.age} years old
- Preferred Language: {profile.preferred_language}
- Learning Level: {profile.learning_level}
- Areas needing practice: {weak_areas_str}
- Strong areas: {strong_areas_str}
- Sessions completed: {profile.sessions_completed}

Teaching Instructions:
- Respond in {profile.preferred_language}
- Use vocabulary appropriate for a {profile.age}-year-old
- Focus extra attention on weak areas: {weak_areas_str}
- Build confidence by occasionally referencing strong areas: {strong_areas_str}
- Keep explanations very simple for {profile.learning_level} level
"""
    return context


def update_child_progress(child_id: str, topic: str, score: int) -> bool:
    """
    Update a child's progress for a specific topic.
    Returns True if successful, False if child not found.
    """
    profile = CHILD_PROFILES.get(child_id)
    if not profile:
        return False

    profile.progress[topic] = min(100, max(0, score))  # Clamp between 0-100
    return True


def increment_sessions(child_id: str) -> bool:
    """
    Increment the session count for a child.
    Returns True if successful, False if child not found.
    """
    profile = CHILD_PROFILES.get(child_id)
    if not profile:
        return False

    profile.sessions_completed += 1
    return True
