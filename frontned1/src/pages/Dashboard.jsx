import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import {
  FaFont,
  FaCalculator,
  FaPalette,
  FaShapes,
  FaMusic,
  FaGamepad,
  FaStar,
  FaCheck,
  FaTrophy,
  FaCoins,
  FaFire,
} from "react-icons/fa";
import "../styles/dashboard-new.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Game state management
  const [gameStats, setGameStats] = useState({
    coins: 125,
    level: 3,
    current_streak: 5,
    best_streak: 8,
    accuracy_percentage: 78.5,
    badges_earned: [
      { id: "first_success", icon: "🌟", name: "First Success!" },
      { id: "streak_master", icon: "🔥", name: "Streak Master" },
    ],
    coins_for_next_level: 75,
    level_progress_percentage: 62,
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const childId = user?.id || "child_007";

  // Load game progress function
  const loadGameProgress = useCallback(async () => {
    try {
      const response = await fetch(
        `https://genai-7j5d.onrender.com/api/game/progress/${childId}`
      );
      const data = await response.json();

      if (data.success) {
        setGameStats(data.data);
      }
    } catch {
      console.log("Game API not available, using mock data");
    }
  }, [childId]);

  // Load game progress on mount
  useEffect(() => {
    loadGameProgress();
  }, [loadGameProgress]);

  // Enhanced dashboard items with gamification
  const dashboardItems = [
    {
      title: t("dashboard.alphabet", "Alphabet"),
      icon: <FaFont />,
      color: "#58CC02", // Green
      topic: "alphabet",
      progress: 75,
      locked: false,
      coinsEarned: 25,
      questionsCompleted: 12,
    },
    {
      title: t("dashboard.numbers", "Numbers"),
      icon: <FaCalculator />,
      color: "#1CB0F6", // Blue
      topic: "numbers_1_to_10",
      progress: 50,
      locked: false,
      coinsEarned: 40,
      questionsCompleted: 8,
    },
    {
      title: t("dashboard.colors", "Colors"),
      icon: <FaPalette />,
      color: "#FF9600", // Orange
      topic: "colors",
      progress: 30,
      locked: false,
      coinsEarned: 15,
      questionsCompleted: 5,
    },
    {
      title: t("dashboard.shapes", "Shapes"),
      icon: <FaShapes />,
      color: "#CE82FF", // Purple
      topic: "shapes",
      progress: 0,
      locked: gameStats.level < 2, // Unlock at level 2
      coinsEarned: 0,
      questionsCompleted: 0,
    },
    {
      title: t("dashboard.animals", "Animals"),
      icon: <span>🦁</span>,
      color: "#FF86D0", // Pink
      topic: "animals",
      progress: 60,
      locked: false,
      coinsEarned: 30,
      questionsCompleted: 10,
    },
    {
      title: t("dashboard.fruits", "Fruits"),
      icon: <span>🍎</span>,
      color: "#4ECDC4", // Teal
      topic: "fruits",
      progress: 20,
      locked: gameStats.level < 3, // Unlock at level 3
      coinsEarned: 10,
      questionsCompleted: 3,
    },
    {
      title: t("dashboard.ai_quiz", "AI Quiz Challenge"),
      icon: <FaGamepad />,
      color: "#FF4B4B", // Red
      topic: "mixed",
      progress: 25,
      locked: false,
      coinsEarned: 50,
      questionsCompleted: 15,
      isGameMode: true,
    },
  ];

  const handleCardClick = (item) => {
    if (item.locked) {
      return;
    }

    if (item.isGameMode) {
      // Navigate to gamified learning page
      navigate("/gamified-learning");
    } else {
      // Navigate to appropriate learning pages
      switch (item.topic) {
        case "alphabet":
          navigate("/alphabet");
          break;
        case "numbers_1_to_10":
          navigate("/numbers");
          break;
        case "colors":
          navigate("/colors");
          break;
        case "shapes":
          navigate("/shapes");
          break;
        case "animals":
          navigate("/animals");
          break;
        case "fruits":
          navigate("/fruits");
          break;
        default:
          navigate(`/${item.topic}`);
      }
    }
  };

  const startQuizChallenge = async (topic) => {
    setIsLoading(true);
    setShowQuestionModal(true);

    try {
      const response = await fetch(
        "https://genai-7j5d.onrender.com/api/game/question/start-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            child_id: childId,
            topic: topic === "mixed" ? null : topic,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCurrentQuestion(data.data.session);
      } else {
        // Fallback to mock question if API fails
        setCurrentQuestion(generateMockQuestion(topic));
      }
    } catch {
      console.log("Game API not available, using mock question");
      setCurrentQuestion(generateMockQuestion(topic));
    }

    setIsLoading(false);
  };

  const generateMockQuestion = (topic) => {
    const mockQuestions = {
      animals: {
        question_text: "What sound does a cat make?",
        options: ["A) Meow", "B) Woof", "C) Moo", "D) Roar"],
        correct_answer: "A) Meow",
      },
      colors: {
        question_text: "What color is the sun?",
        options: ["A) Blue", "B) Yellow", "C) Green", "D) Red"],
        correct_answer: "B) Yellow",
      },
      mixed: {
        question_text: "How many fingers do you have on one hand?",
        options: ["A) Three", "B) Four", "C) Five", "D) Six"],
        correct_answer: "C) Five",
      },
    };

    const questionData = mockQuestions[topic] || mockQuestions.mixed;
    return {
      question_id: `mock_${Date.now()}`,
      question_text: questionData.question_text,
      options: questionData.options,
      difficulty: "medium",
      topic: topic,
    };
  };

  const submitAnswer = async (answer) => {
    if (!currentQuestion) return;

    setSelectedAnswer(answer);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://genai-7j5d.onrender.com/api/game/answer/submit-secure",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            child_id: childId,
            question_id: currentQuestion.question_id,
            selected_answer: answer,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setLastResult(data.data.evaluation);
        setGameStats(data.data.updated_stats);
      } else {
        // Mock result if API fails
        const questionId = currentQuestion?.question_id || "default";
        const mockCorrect = questionId.length % 3 !== 0; // Deterministic based on question
        setLastResult({
          is_correct: mockCorrect,
          coins_earned: mockCorrect ? 5 : 0,
          feedback_message: mockCorrect
            ? "Great job! 🌟"
            : "Good try! Keep learning! 💪",
          level_up: false,
          new_badge: null,
        });
        if (mockCorrect) {
          setGameStats((prev) => ({
            ...prev,
            coins: prev.coins + 5,
            current_streak: prev.current_streak + 1,
          }));
        }
      }
    } catch {
      console.log("Using mock result");
      const questionId = currentQuestion?.question_id || "fallback";
      const mockCorrect = questionId.length % 4 !== 0; // Deterministic based on question
      setLastResult({
        is_correct: mockCorrect,
        coins_earned: mockCorrect ? 5 : 0,
        feedback_message: mockCorrect
          ? "Great job! 🌟"
          : "Good try! Keep learning! 💪",
        level_up: false,
        new_badge: null,
      });
      if (mockCorrect) {
        setGameStats((prev) => ({
          ...prev,
          coins: prev.coins + 5,
          current_streak: prev.current_streak + 1,
        }));
      }
    }

    setShowResult(true);
    setIsLoading(false);

    // Auto close modal after showing result
    setTimeout(() => {
      closeQuestionModal();
    }, 3000);
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setLastResult(null);
  };

  const userName = user?.name || "Explorer";

  return (
    <div className="dashboard-container">
      <Navbar />
      <Container className="dashboard-main">
        {/* Welcome Section */}
        <header className="welcome-section">
          <h1 className="dashboard-title">
            <span className="wave">👋</span>
            {t("dashboard.welcome", "Hi, {{name}}!", { name: userName })}
          </h1>
          <p className="dashboard-subtitle">
            {t("dashboard.subtitle", "What would you like to learn today?")}
          </p>
        </header>

        {/* Dashboard Cards */}
        <Row className="g-3 g-md-4 px-2">
          {dashboardItems.map((item, index) => (
            <Col key={index} xs={6} md={4}>
              <Card
                className={`dashboard-card ${item.locked ? "locked" : ""}`}
                style={{ "--accent-color": item.color }}
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={item.locked ? -1 : 0}
              >
                <Card.Body className="card-body-custom">
                  {/* Progress indicator */}
                  {item.progress > 0 && !item.locked && (
                    <div className="card-progress">
                      <div
                        className="card-progress-fill"
                        style={{
                          width: `${item.progress}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  )}

                  {/* Lock overlay */}
                  {item.locked && (
                    <div className="lock-overlay">
                      <span>🔒</span>
                    </div>
                  )}

                  {/* Completion badge */}
                  {item.progress === 100 && (
                    <div
                      className="completion-badge"
                      style={{ background: item.color }}
                    >
                      <FaCheck />
                    </div>
                  )}

                  <div
                    className="icon-wrapper"
                    style={{ background: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="card-title">{item.title}</h3>

                  {/* Progress text */}
                  {!item.locked && item.progress > 0 && (
                    <span className="progress-text">
                      {t("dashboard.progress", "{{progress}}% complete", {
                        progress: item.progress,
                      })}
                    </span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Enhanced Stats Section */}
        <div className="gamification-bar">
          <div className="stat-item coins-stat">
            <span className="stat-icon">
              <FaCoins color="#FFD700" />
            </span>
            <div className="stat-details">
              <span className="stat-value">{gameStats.coins}</span>
              <span className="stat-label">Coins</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item streak-stat">
            <span className="stat-icon">
              <FaFire color="#FF6B6B" />
            </span>
            <div className="stat-details">
              <span className="stat-value">{gameStats.current_streak}</span>
              <span className="stat-label">Streak</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item level-stat">
            <span className="stat-icon">
              <FaTrophy color="#4ECDC4" />
            </span>
            <div className="stat-details">
              <span className="stat-value">{gameStats.level}</span>
              <span className="stat-label">Level</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item accuracy-stat">
            <span className="stat-icon">🎯</span>
            <div className="stat-details">
              <span className="stat-value">
                {Math.round(gameStats.accuracy_percentage)}%
              </span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="level-progress-section">
          <div className="progress-header">
            <span>🏆 Level {gameStats.level}</span>
            <span className="coins-to-next">
              {gameStats.coins_for_next_level > 0
                ? `${gameStats.coins_for_next_level} coins to next level`
                : "Max level reached!"}
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${gameStats.level_progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Badges Section */}
        {gameStats.badges_earned && gameStats.badges_earned.length > 0 && (
          <div className="badges-section">
            <h4 className="badges-title">
              🏆 Your Badges ({gameStats.badges_earned.length})
            </h4>
            <div className="badges-grid">
              {gameStats.badges_earned.map((badge, index) => (
                <div key={index} className="badge-item">
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      <Footer />

      {/* AI Quiz Question Modal */}
      <Modal
        show={showQuestionModal}
        onHide={closeQuestionModal}
        centered
        size="lg"
      >
        <Modal.Body className="question-modal-body">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner">🎮</div>
              <p>Loading your challenge...</p>
            </div>
          ) : showResult && lastResult ? (
            <div
              className={`result-display ${
                lastResult.is_correct ? "correct" : "incorrect"
              }`}
            >
              <div className="result-icon">
                {lastResult.is_correct ? "🎉" : "💝"}
              </div>
              <h3 className="result-message">{lastResult.feedback_message}</h3>
              {lastResult.coins_earned > 0 && (
                <div className="coins-earned">
                  <FaCoins color="#FFD700" />
                  <span>+{lastResult.coins_earned} coins!</span>
                </div>
              )}
              {lastResult.level_up && (
                <div className="level-up">
                  <FaTrophy color="#4ECDC4" />
                  <span>LEVEL UP!</span>
                </div>
              )}
              {lastResult.new_badge && (
                <div className="new-badge">
                  🏆 <span>New Badge Earned!</span>
                </div>
              )}
            </div>
          ) : currentQuestion ? (
            <div className="question-container">
              <div className="question-header">
                <span className="difficulty-badge">
                  {currentQuestion.difficulty}
                </span>
                <span className="topic-badge">📚 {currentQuestion.topic}</span>
              </div>

              <h3 className="question-text">{currentQuestion.question_text}</h3>

              <div className="answer-options">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    className={`answer-option ${
                      selectedAnswer === option ? "selected" : ""
                    }`}
                    onClick={() => submitAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <p className="question-hint">
                🤔 Take your time and choose the best answer!
              </p>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>

      {/* Floating AI Assistant */}
      <button
        className="ai-assistant-btn"
        aria-label={t("dashboard.aiAssistant", "Talk to me")}
        onClick={() => navigate("/voice-assistant")}
      >
        <span className="pulse"></span>
        <span className="ai-emoji">🎤</span>
      </button>
    </div>
  );
}

export default Dashboard;
