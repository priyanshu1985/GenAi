"""
AI Question Generation Service
Generates educational questions using OpenRouter/LLMs based on difficulty and topics
"""

import json
import uuid
from typing import Dict, List, Optional
from models.game_model import Question, DifficultyLevel, QuestionType
from AI.llm import generate_text  # Using existing LLM service


class QuestionGeneratorService:
    """Generates age-appropriate questions for children using AI"""
    
    # Topics suitable for children aged 3-7
    CHILD_TOPICS = [
        "colors", "shapes", "numbers_1_to_10", "animals", "fruits", 
        "vegetables", "body_parts", "family_members", "weather",
        "vehicles", "toys", "food", "clothes", "emotions"
    ]
    
    @staticmethod
    def generate_question(
        difficulty: DifficultyLevel,
        topic: str = None,
        child_age: int = 5,
        previous_questions: List[str] = None
    ) -> Question:
        """
        Generate a question based on difficulty and topic
        """
        # Use random topic if none specified
        if not topic:
            import random
            topic = random.choice(QuestionGeneratorService.CHILD_TOPICS)
        
        # Ensure topic is appropriate for children
        if topic not in QuestionGeneratorService.CHILD_TOPICS:
            topic = "animals"  # Safe fallback
        
        # Create AI prompt based on difficulty
        prompt = QuestionGeneratorService._create_question_prompt(
            difficulty, topic, child_age, previous_questions
        )
        
        try:
            # Generate question using existing LLM service
            ai_response = generate_text(prompt)
            
            # Parse AI response into question format
            question = QuestionGeneratorService._parse_ai_response(
                ai_response, topic, difficulty
            )
            
            return question
            
        except Exception as e:
            print(f"Error generating question: {e}")
            # Return fallback question if AI fails
            return QuestionGeneratorService._get_fallback_question(difficulty, topic)
    
    @staticmethod
    def _create_question_prompt(
        difficulty: DifficultyLevel,
        topic: str,
        child_age: int,
        previous_questions: List[str] = None
    ) -> str:
        """Create AI prompt for question generation"""
        
        # Base context
        context = f"""
You are creating educational questions for a {child_age}-year-old child.
The questions should be fun, simple, and age-appropriate.

Topic: {topic}
Difficulty: {difficulty.value}

Difficulty guidelines:
- EASY: Very simple, obvious answers, single concepts
- MEDIUM: Requires some thinking but still straightforward  
- HARD: Requires more reasoning or combines concepts

Requirements:
1. Question must be appropriate for a {child_age}-year-old
2. Use simple, clear language
3. Create exactly 4 answer options (A, B, C, D)
4. Only ONE correct answer
5. Include a brief, child-friendly explanation
6. Make it fun and engaging!

"""
        
        # Add difficulty-specific instructions
        if difficulty == DifficultyLevel.EASY:
            context += """
For EASY questions:
- Use very obvious, simple concepts
- Questions like "What color is an apple?" or "How many legs does a dog have?"
- Answers should be immediately recognizable
"""
        elif difficulty == DifficultyLevel.MEDIUM:
            context += """
For MEDIUM questions:
- Require some basic reasoning
- Questions like "Which animal lives in water?" or "What do we use to write?"
- Child should know but needs to think briefly
"""
        else:  # HARD
            context += """
For HARD questions:
- Require more thinking or combining ideas
- Questions like "Which food helps your teeth grow strong?" or "What happens when water gets very cold?"
- Still appropriate for age but requires more reasoning
"""
        
        # Add examples of previously asked questions to avoid repetition
        if previous_questions:
            context += f"\nAvoid repeating these recent questions: {', '.join(previous_questions[-5:])}"
        
        # Format requirements
        context += """

IMPORTANT: Respond in this EXACT JSON format:
{
  "question": "Your question text here?",
  "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
  "correct_answer": "A) First option",
  "explanation": "Simple explanation why this is correct, in child-friendly language"
}

Make sure the JSON is valid and complete!
"""
        
        return context
    
    @staticmethod
    def _parse_ai_response(ai_response: str, topic: str, difficulty: DifficultyLevel) -> Question:
        """Parse AI response into Question object"""
        try:
            # Try to extract JSON from AI response
            json_start = ai_response.find('{')
            json_end = ai_response.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_str = ai_response[json_start:json_end]
                question_data = json.loads(json_str)
                
                return Question(
                    question_id=str(uuid.uuid4()),
                    text=question_data['question'],
                    options=question_data['options'],
                    correct_answer=question_data['correct_answer'],
                    explanation=question_data['explanation'],
                    topic=topic,
                    difficulty=difficulty,
                    question_type=QuestionType.MULTIPLE_CHOICE
                )
            else:
                raise ValueError("No valid JSON found in AI response")
                
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            print(f"AI Response: {ai_response}")
            # Return fallback question
            return QuestionGeneratorService._get_fallback_question(difficulty, topic)
    
    @staticmethod
    def _get_fallback_question(difficulty: DifficultyLevel, topic: str) -> Question:
        """Get a safe fallback question if AI generation fails"""
        
        fallback_questions = {
            DifficultyLevel.EASY: {
                "animals": {
                    "question": "What sound does a cat make?",
                    "options": ["A) Meow", "B) Woof", "C) Moo", "D) Roar"],
                    "correct": "A) Meow",
                    "explanation": "Cats say 'meow'! Dogs say 'woof', cows say 'moo', and lions roar!"
                },
                "colors": {
                    "question": "What color is the sun?",
                    "options": ["A) Yellow", "B) Purple", "C) Green", "D) Blue"],
                    "correct": "A) Yellow",
                    "explanation": "The sun is bright yellow! It gives us light and warmth."
                }
            },
            DifficultyLevel.MEDIUM: {
                "animals": {
                    "question": "Which animal lives in the ocean?",
                    "options": ["A) Fish", "B) Elephant", "C) Bird", "D) Cat"],
                    "correct": "A) Fish",
                    "explanation": "Fish live in the ocean! They can breathe underwater."
                },
                "colors": {
                    "question": "What color do you get when you mix red and blue?",
                    "options": ["A) Purple", "B) Green", "C) Orange", "D) Pink"],
                    "correct": "A) Purple",
                    "explanation": "Red and blue make purple! Colors can mix to make new colors."
                }
            },
            DifficultyLevel.HARD: {
                "animals": {
                    "question": "Which animal changes colors to hide?",
                    "options": ["A) Chameleon", "B) Dog", "C) Rabbit", "D) Horse"],
                    "correct": "A) Chameleon",
                    "explanation": "Chameleons can change their skin color to blend in with their surroundings!"
                },
                "colors": {
                    "question": "What are the three primary colors?",
                    "options": ["A) Red, Blue, Yellow", "B) Pink, Green, Purple", "C) Black, White, Gray", "D) Orange, Purple, Green"],
                    "correct": "A) Red, Blue, Yellow",
                    "explanation": "Red, blue, and yellow are primary colors - they can't be made by mixing other colors!"
                }
            }
        }
        
        # Get fallback question for difficulty and topic
        fallback_data = fallback_questions.get(difficulty, {}).get(topic)
        
        # If no specific fallback, use a generic one
        if not fallback_data:
            fallback_data = {
                "question": "How many fingers do you have on one hand?",
                "options": ["A) Five", "B) Three", "C) Seven", "D) Ten"],
                "correct": "A) Five",
                "explanation": "You have five fingers on each hand! Count them: 1, 2, 3, 4, 5!"
            }
        
        return Question(
            question_id=str(uuid.uuid4()),
            text=fallback_data["question"],
            options=fallback_data["options"],
            correct_answer=fallback_data["correct"],
            explanation=fallback_data["explanation"],
            topic=topic,
            difficulty=difficulty,
            question_type=QuestionType.MULTIPLE_CHOICE
        )
    
    @staticmethod
    def explain_answer(question: Question, child_answer: str, is_correct: bool) -> str:
        """Generate child-friendly explanation using AI"""
        
        if is_correct:
            return f"🎉 Correct! {question.explanation}"
        
        # For wrong answers, create encouraging explanation
        prompt = f"""
A {5}-year-old child just answered a question incorrectly. 
Create a very encouraging, simple explanation.

Question: {question.text}
Child chose: {child_answer}
Correct answer: {question.correct_answer}
Original explanation: {question.explanation}

Create a response that:
1. Is encouraging and positive
2. Explains why their answer wasn't quite right (gently)
3. Teaches the correct answer in a friendly way
4. Is very simple for a young child to understand
5. Maximum 2 sentences

Start with an encouraging emoji and phrase!
"""
        
        try:
            explanation = generate_text(prompt)
            return explanation
        except:
            # Fallback encouraging message
            return f"💫 Good try! {question.explanation} You're learning so well!"


    @staticmethod 
    def get_next_topic_suggestion(child_stats: Dict) -> str:
        """Suggest next topic based on child's performance"""
        # Simple topic rotation for now
        # In a real system, this could be more sophisticated
        import random
        return random.choice(QuestionGeneratorService.CHILD_TOPICS)