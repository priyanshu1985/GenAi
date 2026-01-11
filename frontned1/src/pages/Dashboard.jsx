import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import {
  FaFont,
  FaCalculator,
  FaPalette,
  FaShapes,
  FaGamepad,
  FaCheck,
  FaTrophy,
  FaCoins,
} from "react-icons/fa";
import "../styles/dashboard-new.css";
import Navbar from "../components/Navbar";

// API Configuration - uses environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://genai-7j5d.onrender.com";

// Course color configuration
const COURSE_COLORS = {
  alphabet: { primary: "#FF6B6B", gradient: "linear-gradient(135deg, #FF6B6B 0%, #ee5a5a 100%)" },
  numbers: { primary: "#4ECDC4", gradient: "linear-gradient(135deg, #4ECDC4 0%, #44b3ab 100%)" },
  colors: { primary: "#FFE66D", gradient: "linear-gradient(135deg, #FFE66D 0%, #f5d85e 100%)" },
  shapes: { primary: "#95E1D3", gradient: "linear-gradient(135deg, #95E1D3 0%, #7dd4c4 100%)" },
  animals: { primary: "#F38181", gradient: "linear-gradient(135deg, #F38181 0%, #e86f6f 100%)" },
  fruits: { primary: "#AA96DA", gradient: "linear-gradient(135deg, #AA96DA 0%, #9a85d0 100%)" },
  mixed: { primary: "#667EEA", gradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)" },
};

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

  // Load game progress on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/game/progress/${childId}`
        );
        const data = await response.json();

        if (isMounted && data.success) {
          setGameStats(data.data);
        }
      } catch {
        console.log("Game API not available, using mock data");
      }
    };

    fetchProgress();

    return () => {
      isMounted = false;
    };
  }, [childId]);

  // Enhanced dashboard items with gamification
  const dashboardItems = [
    {
      title: t("dashboard.alphabet", "Alphabet"),
      subtitle: "A B C D...",
      icon: <FaFont />,
      emoji: "🔤",
      color: COURSE_COLORS.alphabet.primary,
      gradient: COURSE_COLORS.alphabet.gradient,
      topic: "alphabet",
      progress: 75,
      locked: false,
      coinsEarned: 25,
      questionsCompleted: 12,
    },
    {
      title: t("dashboard.numbers", "Numbers"),
      subtitle: "1 2 3 4...",
      icon: <FaCalculator />,
      emoji: "🔢",
      color: COURSE_COLORS.numbers.primary,
      gradient: COURSE_COLORS.numbers.gradient,
      topic: "numbers_1_to_10",
      progress: 50,
      locked: false,
      coinsEarned: 40,
      questionsCompleted: 8,
    },
    {
      title: t("dashboard.colors", "Colors"),
      subtitle: "Red, Blue...",
      icon: <FaPalette />,
      emoji: "🎨",
      color: COURSE_COLORS.colors.primary,
      gradient: COURSE_COLORS.colors.gradient,
      topic: "colors",
      progress: 30,
      locked: false,
      coinsEarned: 15,
      questionsCompleted: 5,
    },
    {
      title: t("dashboard.shapes", "Shapes"),
      subtitle: "Circle, Square...",
      icon: <FaShapes />,
      emoji: "🔷",
      color: COURSE_COLORS.shapes.primary,
      gradient: COURSE_COLORS.shapes.gradient,
      topic: "shapes",
      progress: 0,
      locked: gameStats.level < 2,
      coinsEarned: 0,
      questionsCompleted: 0,
    },
    {
      title: t("dashboard.animals", "Animals"),
      subtitle: "Lion, Cat...",
      icon: <span className="emoji-icon">🦁</span>,
      emoji: "🦁",
      color: COURSE_COLORS.animals.primary,
      gradient: COURSE_COLORS.animals.gradient,
      topic: "animals",
      progress: 60,
      locked: false,
      coinsEarned: 30,
      questionsCompleted: 10,
    },
    {
      title: t("dashboard.fruits", "Fruits"),
      subtitle: "Apple, Mango...",
      icon: <span className="emoji-icon">🍎</span>,
      emoji: "🍎",
      color: COURSE_COLORS.fruits.primary,
      gradient: COURSE_COLORS.fruits.gradient,
      topic: "fruits",
      progress: 20,
      locked: gameStats.level < 3,
      coinsEarned: 10,
      questionsCompleted: 3,
    },
    {
      title: t("dashboard.ai_quiz", "AI Quiz"),
      subtitle: "Challenge Mode!",
      icon: <FaGamepad />,
      emoji: "🎮",
      color: COURSE_COLORS.mixed.primary,
      gradient: COURSE_COLORS.mixed.gradient,
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
      navigate("/gamified-learning");
    } else {
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

  const submitAnswer = async (answer) => {
    if (!currentQuestion) return;

    setSelectedAnswer(answer);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/game/answer/submit-secure`,
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
        const questionId = currentQuestion?.question_id || "default";
        const mockCorrect = questionId.length % 3 !== 0;
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
      const mockCorrect = questionId.length % 4 !== 0;
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
          <div className="welcome-content">
            <h1 className="dashboard-title">
              <span className="wave">👋</span>
              {t("dashboard.welcome", "Namaste, {{name}}!", { name: userName })}
            </h1>
            <p className="dashboard-subtitle">
              {t("dashboard.subtitle", "Aaj kya seekhna hai? Let's have fun learning!")}
            </p>
          </div>

          {/* Child Avatar */}
          <div className="child-avatar-section">
            <div className="child-avatar">
              <span>👶</span>
            </div>
            <span className="child-name">{userName}</span>
          </div>
        </header>

        {/* Course Cards Grid */}
        <div className="courses-section">
          <h2 className="section-title">
            <span>📚</span> Choose Your Adventure
          </h2>

          <Row className="g-4 courses-grid">
            {dashboardItems.map((item, index) => (
              <Col key={index} xs={6} md={4} lg={4}>
                <Card
                  className={`course-card ${item.locked ? "locked" : ""}`}
                  style={{
                    "--accent-color": item.color,
                    "--accent-gradient": item.gradient
                  }}
                  onClick={() => handleCardClick(item)}
                  role="button"
                  tabIndex={item.locked ? -1 : 0}
                >
                  {/* Top Border Gradient */}
                  <div className="card-top-border" style={{ background: item.gradient }}></div>

                  <Card.Body className="course-card-body">
                    {/* Lock Overlay */}
                    {item.locked && (
                      <div className="lock-overlay">
                        <span className="lock-icon">🔒</span>
                        <span className="lock-text">Level {item.topic === "shapes" ? 2 : 3} Required</span>
                      </div>
                    )}

                    {/* Completion Badge */}
                    {item.progress === 100 && (
                      <div className="completion-badge" style={{ background: item.gradient }}>
                        <FaCheck />
                      </div>
                    )}

                    {/* Course Icon */}
                    <div className="course-icon" style={{ background: item.gradient }}>
                      {item.icon}
                    </div>

                    {/* Course Info */}
                    <h3 className="course-title">{item.title}</h3>
                    <p className="course-subtitle">{item.subtitle}</p>

                    {/* Progress Bar */}
                    {!item.locked && item.progress > 0 && (
                      <div className="course-progress-container">
                        <div className="course-progress-bar">
                          <div
                            className="course-progress-fill"
                            style={{
                              width: `${item.progress}%`,
                              background: item.gradient
                            }}
                          />
                        </div>
                        <span className="course-progress-text">{item.progress}%</span>
                      </div>
                    )}

                    {/* Continue Button */}
                    {!item.locked && (
                      <button
                        className="continue-btn"
                        style={{ background: item.gradient }}
                      >
                        {item.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Level Progress Section */}
        <div className="level-progress-section">
          <div className="progress-header">
            <span className="level-title">
              <FaTrophy style={{ color: "#FFD700" }} /> Level {gameStats.level} Progress
            </span>
            <span className="coins-to-next">
              {gameStats.coins_for_next_level > 0
                ? `🪙 ${gameStats.coins_for_next_level} coins to Level ${gameStats.level + 1}`
                : "🎉 Max level reached!"}
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
              🏆 Your Achievements ({gameStats.badges_earned.length})
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

      {/* AI Quiz Question Modal */}
      <Modal
        show={showQuestionModal}
        onHide={closeQuestionModal}
        centered
        size="lg"
        className="quiz-modal"
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
                {lastResult.is_correct ? "🎉" : "💪"}
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
                  <span>LEVEL UP! 🚀</span>
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

      {/* Floating AI Assistant Button */}
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
