const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://genai-7j5d.onrender.com";

// Helper to get auth headers with language support
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const language = localStorage.getItem("selectedLanguage") || "hi";

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Accept-Language": language,
  };
};

// Generic API request handler with language support
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  console.log(
    `🎮 Game API Request: ${endpoint} with language: ${
      getAuthHeaders()["Accept-Language"]
    }`
  );

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// Game API functions
const gameAPI = {
  // Get child's game progress (coins, levels, badges, etc.)
  getChildProgress: async (childId) => {
    try {
      return await apiRequest(`/api/game/progress/${childId}`);
    } catch (error) {
      console.warn("⚠️ Game API unavailable, using mock data:", error.message);
      // Mock response for demo/fallback
      return {
        success: true,
        data: {
          coins: 125,
          level: 3,
          current_streak: 5,
          best_streak: 8,
          accuracy_percentage: 78.5,
          badges_earned: [
            { icon: "🌟", name: "First Success!" },
            { icon: "🔥", name: "Streak Master" },
            { icon: "🏆", name: "Level Champion" },
          ],
          coins_for_next_level: 75,
          level_progress_percentage: 62,
        },
      };
    }
  },

  // Start a new question session for a topic
  startQuestionSession: async (childId, topic, difficulty = "easy") => {
    try {
      return await apiRequest("/api/game/question/start-session", {
        method: "POST",
        body: JSON.stringify({
          child_id: childId,
          topic: topic,
          difficulty: difficulty,
        }),
      });
    } catch (error) {
      console.warn(
        "⚠️ Question API unavailable, using mock data:",
        error.message
      );
      // Mock response with questions based on topic
      const mockQuestions = {
        animals: [
          {
            question_id: "q_animal_1",
            question_text: "What sound does a cat make? 🐱",
            options: ["A) Meow", "B) Woof", "C) Moo", "D) Roar"],
            correct_answer: "A) Meow",
            hint: "Think about your pet cat at home!",
          },
          {
            question_id: "q_animal_2",
            question_text: "Which animal has a trunk? 🐘",
            options: ["A) Dog", "B) Elephant", "C) Cat", "D) Bird"],
            correct_answer: "B) Elephant",
            hint: "This big animal uses its nose to pick things up!",
          },
        ],
        colors: [
          {
            question_id: "q_color_1",
            question_text: "What color is the sun? ☀️",
            options: ["A) Blue", "B) Yellow", "C) Green", "D) Purple"],
            correct_answer: "B) Yellow",
            hint: "Look up at the sky on a sunny day!",
          },
          {
            question_id: "q_color_2",
            question_text: "What color are strawberries? 🍓",
            options: ["A) Blue", "B) Yellow", "C) Red", "D) Purple"],
            correct_answer: "C) Red",
            hint: "Think about the sweet fruit you love!",
          },
        ],
        numbers: [
          {
            question_id: "q_number_1",
            question_text: "What comes after 5? 🔢",
            options: ["A) 4", "B) 6", "C) 7", "D) 3"],
            correct_answer: "B) 6",
            hint: "Count on your fingers: 1, 2, 3, 4, 5, ?",
          },
          {
            question_id: "q_number_2",
            question_text: "How many fingers do you have on one hand? ✋",
            options: ["A) 4", "B) 6", "C) 5", "D) 3"],
            correct_answer: "C) 5",
            hint: "Hold up one hand and count!",
          },
        ],
        shapes: [
          {
            question_id: "q_shape_1",
            question_text: "How many sides does a triangle have? 📐",
            options: ["A) 2", "B) 3", "C) 4", "D) 5"],
            correct_answer: "B) 3",
            hint: "Look at the shape △ and count the lines!",
          },
          {
            question_id: "q_shape_2",
            question_text: "What shape is a ball? ⚽",
            options: ["A) Square", "B) Triangle", "C) Circle", "D) Rectangle"],
            correct_answer: "C) Circle",
            hint: "Think about how a ball rolls!",
          },
        ],
      };

      const questions = mockQuestions[topic] || mockQuestions.animals;

      return {
        success: true,
        data: {
          session_id: `session_${Date.now()}`,
          question: questions[Math.floor(Math.random() * questions.length)],
          topic: topic,
          difficulty: difficulty,
        },
      };
    }
  },

  // Submit an answer and get evaluation
  submitAnswer: async (childId, questionId, selectedAnswer, sessionId) => {
    try {
      return await apiRequest("/api/game/answer/submit-secure", {
        method: "POST",
        body: JSON.stringify({
          child_id: childId,
          question_id: questionId,
          selected_answer: selectedAnswer,
          session_id: sessionId,
        }),
      });
    } catch (error) {
      console.warn(
        "⚠️ Submit Answer API unavailable, using mock evaluation:",
        error.message
      );
      // Mock evaluation logic
      const isCorrect = Math.random() > 0.3; // 70% chance of being correct for demo
      const coinsEarned = isCorrect
        ? Math.floor(Math.random() * 10) + 5
        : Math.floor(Math.random() * 3) + 1;

      return {
        success: true,
        data: {
          evaluation: {
            is_correct: isCorrect,
            coins_earned: coinsEarned,
            streak_updated: isCorrect,
            level_up: coinsEarned > 8,
            new_badge:
              coinsEarned > 8
                ? { icon: "⭐", name: "Achievement Unlocked!" }
                : null,
            feedback_message: isCorrect
              ? "🎉 Amazing work! You're so smart!"
              : "💝 Good try! Every attempt makes you stronger!",
            detailed_explanation: isCorrect
              ? "🌟 Perfect! You really know your stuff!"
              : "🤗 That's okay! Learning is about trying. You're doing great!",
          },
          updated_stats: {
            coins: 150 + coinsEarned,
            level: 3,
            current_streak: isCorrect ? 6 : 0,
            accuracy_percentage: isCorrect ? 80 : 75,
          },
        },
      };
    }
  },

  // Get next question in session
  getNextQuestion: async (sessionId) => {
    try {
      return await apiRequest(`/api/game/question/next/${sessionId}`);
    } catch (error) {
      console.warn("⚠️ Next Question API unavailable:", error.message);
      // Return end of session
      return {
        success: false,
        message: "Session completed! Great job! 🎉",
      };
    }
  },
};

export default gameAPI;
