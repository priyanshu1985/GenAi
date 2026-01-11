"""
Game Routes
FastAPI endpoints for gamified learning system
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, Dict, Any
from pydantic import BaseModel

from models.game_model import AnswerSubmission, DifficultyLevel
from services.game_service import GameService
from services.question_service import QuestionGeneratorService
from utils import success, error

router = APIRouter(prefix="/game", tags=["Game"])


class QuestionRequest(BaseModel):
    child_id: str
    topic: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None


class SubmitAnswerRequest(BaseModel):
    child_id: str
    question_id: str
    selected_answer: str
    time_taken: Optional[int] = None


# ============================================================
# GAME PROGRESS ENDPOINTS
# ============================================================

@router.get("/progress/{child_id}")
async def get_child_progress(child_id: str):
    """
    Get complete game progress and stats for a child
    """
    try:
        stats = GameService.get_child_stats(child_id)
        return success(stats)
    except Exception as e:
        print(f"Error getting child progress: {e}")
        return error(f"Failed to get progress: {str(e)}", 500)


@router.get("/leaderboard")
async def get_leaderboard(limit: int = Query(10, ge=1, le=50)):
    """
    Get top children by coins (for motivation)
    """
    try:
        # This would typically query the database
        # For now, return sample data for demo
        leaderboard = [
            {"child_id": "child_001", "name": "Priyanshu", "coins": 250, "level": 5},
            {"child_id": "child_002", "name": "Aaisha", "coins": 180, "level": 4},
            {"child_id": "child_003", "name": "Arjun", "coins": 150, "level": 3}
        ]
        return success({"leaderboard": leaderboard})
    except Exception as e:
        return error(f"Failed to get leaderboard: {str(e)}", 500)


# ============================================================
# QUESTION GENERATION ENDPOINTS  
# ============================================================

@router.post("/question/generate")
async def generate_question(request: QuestionRequest):
    """
    Generate a new question based on child's progress and difficulty
    """
    try:
        # Get child's current progress to determine difficulty
        progress = GameService.get_child_progress(request.child_id)
        
        # Use requested difficulty or child's current difficulty
        difficulty = request.difficulty or progress.current_difficulty
        
        # Generate question using AI
        question = QuestionGeneratorService.generate_question(
            difficulty=difficulty,
            topic=request.topic,
            child_age=5  # Default age, could be stored in child profile
        )
        
        return success({
            "question": {
                "id": question.question_id,
                "text": question.text,
                "options": question.options,
                "topic": question.topic,
                "difficulty": question.difficulty.value,
                "question_type": question.question_type.value
            },
            "child_stats": {
                "coins": progress.coins,
                "streak": progress.current_streak,
                "level": progress.level,
                "difficulty": difficulty.value
            }
        })
        
    except Exception as e:
        print(f"Error generating question: {e}")
        return error(f"Failed to generate question: {str(e)}", 500)


# ============================================================
# ANSWER EVALUATION ENDPOINTS
# ============================================================

@router.post("/answer/submit")
async def submit_answer(request: SubmitAnswerRequest):
    """
    Submit and evaluate a child's answer
    Core endpoint for game progression!
    """
    try:
        # For demo purposes, we need to store the correct answer somewhere
        # In a real app, you'd store this securely or re-generate to verify
        # For now, let's get it from a simple cache or session
        
        # TODO: Implement secure answer verification
        # This is a simplified version for the hackathon
        correct_answer = "A)"  # This should come from secure storage
        
        submission = AnswerSubmission(
            child_id=request.child_id,
            question_id=request.question_id,
            selected_answer=request.selected_answer,
            time_taken=request.time_taken
        )
        
        # Evaluate the answer and update progress
        result = GameService.evaluate_answer(submission, correct_answer)
        
        # Get updated stats
        updated_stats = GameService.get_child_stats(request.child_id)
        
        return success({
            "evaluation": {
                "is_correct": result.is_correct,
                "coins_earned": result.coins_earned,
                "streak_updated": result.streak_updated,
                "level_up": result.level_up,
                "new_badge": result.new_badge,
                "feedback_message": result.feedback_message,
                "next_difficulty": result.next_difficulty.value
            },
            "updated_stats": updated_stats
        })
        
    except Exception as e:
        print(f"Error submitting answer: {e}")
        return error(f"Failed to evaluate answer: {str(e)}", 500)


# ============================================================
# SECURE ANSWER VERIFICATION (Better Implementation)
# ============================================================

# Store questions temporarily for verification
_active_questions = {}

@router.post("/question/start-session")
async def start_question_session(request: QuestionRequest):
    """
    Start a new question session with secure answer storage
    Better implementation for answer verification
    """
    try:
        # Get child's current progress
        progress = GameService.get_child_progress(request.child_id)
        
        # Generate question
        question = QuestionGeneratorService.generate_question(
            difficulty=request.difficulty or progress.current_difficulty,
            topic=request.topic,
            child_age=5
        )
        
        # Store correct answer securely (in production, use Redis or encrypted storage)
        session_key = f"{request.child_id}_{question.question_id}"
        _active_questions[session_key] = {
            "correct_answer": question.correct_answer,
            "question": question,
            "timestamp": str(datetime.now())
        }
        
        # Return question without correct answer
        return success({
            "session": {
                "question_id": question.question_id,
                "question_text": question.text,
                "options": question.options,
                "topic": question.topic,
                "difficulty": question.difficulty.value
            },
            "child_stats": {
                "coins": progress.coins,
                "streak": progress.current_streak,
                "level": progress.level,
                "current_difficulty": progress.current_difficulty.value
            }
        })
        
    except Exception as e:
        print(f"Error starting question session: {e}")
        return error(f"Failed to start session: {str(e)}", 500)


@router.post("/answer/submit-secure")  
async def submit_answer_secure(request: SubmitAnswerRequest):
    """
    Submit answer with secure verification
    """
    try:
        # Get stored correct answer
        session_key = f"{request.child_id}_{request.question_id}"
        
        if session_key not in _active_questions:
            return error("Invalid question session", 400)
        
        session_data = _active_questions[session_key]
        correct_answer = session_data["correct_answer"]
        question = session_data["question"]
        
        # Clean up session
        del _active_questions[session_key]
        
        # Create submission
        submission = AnswerSubmission(
            child_id=request.child_id,
            question_id=request.question_id,
            selected_answer=request.selected_answer,
            time_taken=request.time_taken
        )
        
        # Evaluate answer
        result = GameService.evaluate_answer(submission, correct_answer)
        
        # Generate detailed explanation
        explanation = QuestionGeneratorService.explain_answer(
            question, 
            request.selected_answer, 
            result.is_correct
        )
        
        # Get updated stats
        updated_stats = GameService.get_child_stats(request.child_id)
        
        return success({
            "evaluation": {
                "is_correct": result.is_correct,
                "coins_earned": result.coins_earned,
                "streak_updated": result.streak_updated,
                "level_up": result.level_up,
                "new_badge": result.new_badge,
                "feedback_message": result.feedback_message,
                "detailed_explanation": explanation,
                "correct_answer": correct_answer,
                "next_difficulty": result.next_difficulty.value
            },
            "updated_stats": updated_stats,
            "question_explanation": question.explanation
        })
        
    except Exception as e:
        print(f"Error submitting secure answer: {e}")
        return error(f"Failed to evaluate answer: {str(e)}", 500)


# ============================================================
# BADGE AND ACHIEVEMENT ENDPOINTS
# ============================================================

@router.get("/badges/{child_id}")
async def get_child_badges(child_id: str):
    """Get all badges for a child"""
    try:
        from models.game_model import GAME_BADGES
        
        progress = GameService.get_child_progress(child_id)
        
        all_badges = []
        for badge in GAME_BADGES:
            badge_info = {
                "id": badge.badge_id,
                "name": badge.name,
                "description": badge.description,
                "icon": badge.icon,
                "earned": badge.badge_id in progress.badges_earned,
                "requirement_coins": badge.requirement_coins,
                "requirement_streak": badge.requirement_streak
            }
            all_badges.append(badge_info)
        
        return success({
            "badges": all_badges,
            "total_earned": len(progress.badges_earned)
        })
        
    except Exception as e:
        return error(f"Failed to get badges: {str(e)}", 500)


# ============================================================
# TOPIC MANAGEMENT
# ============================================================

@router.get("/topics")
async def get_available_topics():
    """Get all available learning topics"""
    try:
        topics = QuestionGeneratorService.CHILD_TOPICS
        
        # Add emoji and descriptions for frontend
        topic_details = {
            "colors": {"name": "Colors", "icon": "🎨", "description": "Learn about different colors!"},
            "shapes": {"name": "Shapes", "icon": "⭕", "description": "Discover circles, squares, and more!"},
            "numbers_1_to_10": {"name": "Numbers", "icon": "🔢", "description": "Count from 1 to 10!"},
            "animals": {"name": "Animals", "icon": "🦁", "description": "Meet amazing animals!"},
            "fruits": {"name": "Fruits", "icon": "🍎", "description": "Tasty and healthy fruits!"},
            "vegetables": {"name": "Vegetables", "icon": "🥕", "description": "Nutritious vegetables!"},
            "weather": {"name": "Weather", "icon": "☀️", "description": "Learn about sun, rain, and more!"},
            "vehicles": {"name": "Vehicles", "icon": "🚗", "description": "Cars, trains, and planes!"},
            "emotions": {"name": "Emotions", "icon": "😊", "description": "Happy, sad, and other feelings!"}
        }
        
        formatted_topics = []
        for topic in topics:
            detail = topic_details.get(topic, {
                "name": topic.title(),
                "icon": "📚",
                "description": f"Learn about {topic}!"
            })
            formatted_topics.append({
                "id": topic,
                **detail
            })
        
        return success({"topics": formatted_topics})
        
    except Exception as e:
        return error(f"Failed to get topics: {str(e)}", 500)


from datetime import datetime