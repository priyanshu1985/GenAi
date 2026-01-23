"""
Game Service
Core game mechanics and logic for the child learning system
"""

import uuid
from typing import Optional, Dict, Any
from datetime import datetime

from models.game_model import (
    GameProgress, AnswerSubmission, AnswerResult, Question,
    DifficultyLevel, GAME_BADGES, get_level_from_coins, 
    get_coins_for_next_level, LEVEL_REQUIREMENTS
)
from services.supabase_service import supabase


class GameService:
    """Handles all game mechanics and progression logic"""
    
    @staticmethod
    def get_child_progress(child_id: str) -> GameProgress:
        """Get or create child's game progress"""
        try:
            # Try to get existing progress
            result = supabase.table('game_progress').select('*').eq('child_id', child_id).execute()
            
            if result.data and len(result.data) > 0:
                progress_data = result.data[0]
                return GameProgress(
                    child_id=progress_data['child_id'],
                    coins=progress_data.get('coins', 0),
                    current_streak=progress_data.get('current_streak', 0),
                    best_streak=progress_data.get('best_streak', 0),
                    level=progress_data.get('level', 1),
                    total_questions_answered=progress_data.get('total_questions_answered', 0),
                    correct_answers=progress_data.get('correct_answers', 0),
                    current_difficulty=DifficultyLevel(progress_data.get('current_difficulty', 'medium')),
                    consecutive_correct=progress_data.get('consecutive_correct', 0),
                    consecutive_wrong=progress_data.get('consecutive_wrong', 0),
                    badges_earned=progress_data.get('badges_earned', [])
                )
            else:
                # Create new progress for first-time player
                new_progress = GameProgress(child_id=child_id)
                GameService._save_progress(new_progress)
                return new_progress
                
        except Exception as e:
            print(f"Error getting child progress: {e}")
            # Return default progress if database error
            return GameProgress(child_id=child_id)
    
    @staticmethod
    def _save_progress(progress: GameProgress) -> bool:
        """Save progress to database"""
        try:
            progress_data = {
                'child_id': progress.child_id,
                'coins': progress.coins,
                'current_streak': progress.current_streak,
                'best_streak': progress.best_streak,
                'level': progress.level,
                'total_questions_answered': progress.total_questions_answered,
                'correct_answers': progress.correct_answers,
                'current_difficulty': progress.current_difficulty.value,
                'consecutive_correct': progress.consecutive_correct,
                'consecutive_wrong': progress.consecutive_wrong,
                'last_played': datetime.now().isoformat(),
                'badges_earned': progress.badges_earned
            }
            
            # Upsert (insert or update)
            result = supabase.table('game_progress').upsert(progress_data).execute()
            return True
        except Exception as e:
            print(f"Error saving progress: {e}")
            return False
    
    @staticmethod
    def evaluate_answer(submission: AnswerSubmission, correct_answer: str) -> AnswerResult:
        """Evaluate child's answer and update game progress"""
        # Get current progress
        progress = GameService.get_child_progress(submission.child_id)
        
        # Check if answer is correct
        is_correct = submission.selected_answer.strip().lower() == correct_answer.strip().lower()
        
        # Initialize result
        result = AnswerResult(
            is_correct=is_correct,
            coins_earned=0,
            streak_updated=0,
            level_up=False,
            feedback_message="",
            next_difficulty=progress.current_difficulty
        )
        
        # Update progress counters
        progress.total_questions_answered += 1
        
        if is_correct:
            # Correct answer logic
            progress.correct_answers += 1
            progress.consecutive_correct += 1
            progress.consecutive_wrong = 0  # Reset wrong streak
            
            # Calculate coins earned
            base_coins = GameService._calculate_coins_for_answer(progress.current_difficulty, progress.consecutive_correct)
            result.coins_earned = base_coins
            progress.coins += base_coins
            
            # Update streak
            progress.current_streak += 1
            if progress.current_streak > progress.best_streak:
                progress.best_streak = progress.current_streak
            result.streak_updated = progress.current_streak
            
            # Check for level up
            old_level = progress.level
            new_level = get_level_from_coins(progress.coins)
            if new_level > old_level:
                progress.level = new_level
                result.level_up = True
            
            # Check for new badges
            new_badge = GameService._check_new_badges(progress)
            if new_badge:
                result.new_badge = new_badge
            
            # Positive feedback
            result.feedback_message = GameService._get_positive_feedback(progress.consecutive_correct)
            
        else:
            # Wrong answer logic
            progress.consecutive_wrong += 1
            progress.consecutive_correct = 0  # Reset correct streak
            progress.current_streak = 0  # Reset overall streak
            result.streak_updated = 0
            
            # Encouraging feedback for wrong answers
            result.feedback_message = GameService._get_encouraging_feedback(progress.consecutive_wrong)
        
        # Update difficulty based on performance (CORE PERSONALIZATION LOGIC)
        result.next_difficulty = GameService._calculate_next_difficulty(progress)
        progress.current_difficulty = result.next_difficulty
        
        # Save updated progress
        GameService._save_progress(progress)
        
        return result
    
    @staticmethod
    def _calculate_coins_for_answer(difficulty: DifficultyLevel, streak: int) -> int:
        """Calculate coins earned for correct answer"""
        base_coins = {
            DifficultyLevel.EASY: 2,
            DifficultyLevel.MEDIUM: 5,
            DifficultyLevel.HARD: 10
        }
        
        coins = base_coins[difficulty]
        
        # Bonus coins for streaks
        if streak >= 3:
            coins += 2  # Streak bonus
        if streak >= 5:
            coins += 3  # Longer streak bonus
        
        return coins
    
    @staticmethod
    def _calculate_next_difficulty(progress: GameProgress) -> DifficultyLevel:
        """
        CORE PERSONALIZED LEARNING LOGIC
        Simple rule-based difficulty adjustment
        """
        # If wrong 2-3 times consecutively → easier
        if progress.consecutive_wrong >= 2:
            if progress.current_difficulty == DifficultyLevel.HARD:
                return DifficultyLevel.MEDIUM
            elif progress.current_difficulty == DifficultyLevel.MEDIUM:
                return DifficultyLevel.EASY
            else:
                return DifficultyLevel.EASY
        
        # If correct 3+ times consecutively → harder
        elif progress.consecutive_correct >= 3:
            if progress.current_difficulty == DifficultyLevel.EASY:
                return DifficultyLevel.MEDIUM
            elif progress.current_difficulty == DifficultyLevel.MEDIUM:
                return DifficultyLevel.HARD
            else:
                return DifficultyLevel.HARD
        
        # Otherwise keep current difficulty
        else:
            return progress.current_difficulty
    
    @staticmethod
    def _check_new_badges(progress: GameProgress) -> Optional[str]:
        """Check if child earned a new badge"""
        for badge in GAME_BADGES:
            if badge.badge_id not in progress.badges_earned:
                # Check badge requirements
                coins_met = progress.coins >= badge.requirement_coins
                streak_met = (badge.requirement_streak is None or 
                            progress.best_streak >= badge.requirement_streak)
                
                if coins_met and streak_met:
                    progress.badges_earned.append(badge.badge_id)
                    return badge.badge_id
        return None
    
    @staticmethod
    def _get_positive_feedback(consecutive_correct: int) -> str:
        """Get encouraging feedback for correct answers"""
        if consecutive_correct == 1:
            return "Great job! 🌟"
        elif consecutive_correct == 2:
            return "You're on fire! 🔥"
        elif consecutive_correct == 3:
            return "Amazing streak! Keep going! 🚀"
        elif consecutive_correct >= 5:
            return "Incredible! You're a superstar! ⭐"
        else:
            return "Excellent work! 👏"
    
    @staticmethod
    def _get_encouraging_feedback(consecutive_wrong: int) -> str:
        """Get encouraging feedback for wrong answers"""
        if consecutive_wrong == 1:
            return "No worries! Let's try another one! 💪"
        elif consecutive_wrong == 2:
            return "You're learning! Don't give up! 🌱"
        else:
            return "Every mistake helps you learn! You've got this! 🌟"
    
    @staticmethod
    def get_child_stats(child_id: str) -> Dict[str, Any]:
        """Get comprehensive stats for child dashboard"""
        progress = GameService.get_child_progress(child_id)
        
        # Calculate accuracy
        accuracy = 0.0
        if progress.total_questions_answered > 0:
            accuracy = (progress.correct_answers / progress.total_questions_answered) * 100
        
        # Get earned badges details
        earned_badges = []
        for badge in GAME_BADGES:
            if badge.badge_id in progress.badges_earned:
                earned_badges.append({
                    "id": badge.badge_id,
                    "name": badge.name,
                    "icon": badge.icon,
                    "description": badge.description
                })
        
        # Coins needed for next level
        coins_for_next_level = get_coins_for_next_level(progress.coins)
        
        return {
            "child_id": child_id,
            "coins": progress.coins,
            "level": progress.level,
            "current_streak": progress.current_streak,
            "best_streak": progress.best_streak,
            "accuracy_percentage": round(accuracy, 1),
            "total_questions": progress.total_questions_answered,
            "correct_answers": progress.correct_answers,
            "current_difficulty": progress.current_difficulty.value,
            "badges_earned": earned_badges,
            "badges_count": len(earned_badges),
            "coins_for_next_level": coins_for_next_level,
            "level_progress_percentage": 0 if coins_for_next_level == 0 else 
                round(((LEVEL_REQUIREMENTS.get(progress.level + 1, progress.coins) - coins_for_next_level) / 
                       LEVEL_REQUIREMENTS.get(progress.level + 1, 1)) * 100, 1)
        }