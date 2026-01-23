"""
Game Logic Models
Database schemas for gamification system
"""

from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium" 
    HARD = "hard"


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"


class GameProgress(BaseModel):
    """Child's game progress tracking"""
    child_id: str
    coins: int = 0
    current_streak: int = 0
    best_streak: int = 0
    level: int = 1
    total_questions_answered: int = 0
    correct_answers: int = 0
    current_difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    consecutive_correct: int = 0
    consecutive_wrong: int = 0
    last_played: Optional[datetime] = None
    badges_earned: List[str] = []


class Badge(BaseModel):
    """Badge definition"""
    badge_id: str
    name: str
    description: str
    icon: str  # emoji or icon name
    requirement_coins: int
    requirement_streak: Optional[int] = None


class Question(BaseModel):
    """Generated question from AI"""
    question_id: str
    text: str
    options: List[str]
    correct_answer: str
    explanation: str
    topic: str
    difficulty: DifficultyLevel
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE


class AnswerSubmission(BaseModel):
    """Answer submitted by child"""
    child_id: str
    question_id: str
    selected_answer: str
    time_taken: Optional[int] = None  # seconds


class AnswerResult(BaseModel):
    """Result of answer evaluation"""
    is_correct: bool
    coins_earned: int
    streak_updated: int
    level_up: bool
    new_badge: Optional[str] = None
    feedback_message: str
    next_difficulty: DifficultyLevel


class GameStats(BaseModel):
    """Child's overall game statistics"""
    child_id: str
    total_coins: int
    current_level: int
    current_streak: int
    accuracy_percentage: float
    favorite_topic: str
    play_time_minutes: int
    badges_count: int


# Predefined badges for the system
GAME_BADGES = [
    Badge(
        badge_id="first_correct",
        name="First Success! 🌟",
        description="Answered your first question correctly!",
        icon="🌟",
        requirement_coins=1
    ),
    Badge(
        badge_id="coin_collector",
        name="Coin Collector 🪙",
        description="Earned 50 coins!",
        icon="🪙",
        requirement_coins=50
    ),
    Badge(
        badge_id="streak_master",
        name="Streak Master 🔥",
        description="Got 5 answers right in a row!",
        icon="🔥",
        requirement_coins=0,
        requirement_streak=5
    ),
    Badge(
        badge_id="knowledge_seeker",
        name="Knowledge Seeker 📚",
        description="Earned 100 coins!",
        icon="📚",
        requirement_coins=100
    ),
    Badge(
        badge_id="learning_champion",
        name="Learning Champion 🏆",
        description="Reached Level 5!",
        icon="🏆",
        requirement_coins=250  # Level 5 requirement
    ),
    Badge(
        badge_id="question_master",
        name="Question Master 🧠",
        description="Answered 100 questions!",
        icon="🧠",
        requirement_coins=0
    )
]


# Level progression (coins needed for each level)
LEVEL_REQUIREMENTS = {
    1: 0,
    2: 25,
    3: 50,
    4: 100,
    5: 200,
    6: 350,
    7: 550,
    8: 800,
    9: 1100,
    10: 1500
}


def get_level_from_coins(coins: int) -> int:
    """Calculate level based on total coins"""
    for level in range(10, 0, -1):
        if coins >= LEVEL_REQUIREMENTS[level]:
            return level
    return 1


def get_coins_for_next_level(current_coins: int) -> int:
    """Get coins needed for next level"""
    current_level = get_level_from_coins(current_coins)
    if current_level >= 10:
        return 0  # Max level reached
    
    next_level_requirement = LEVEL_REQUIREMENTS[current_level + 1]
    return next_level_requirement - current_coins