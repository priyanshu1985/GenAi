/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../hooks/useGame";
import gameAPI from "../services/gameAPI";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Global.css";
import "../styles/dashboard.css";

// Missing component definitions
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner">🎮</div>
    <h3>Loading your next adventure...</h3>
  </div>
);

const WelcomeMessage = () => (
  <div className="welcome-message text-center">
    <h2>🌈 Welcome to Fun Learning! 🌈</h2>
    <p>Choose a topic above to start your learning adventure!</p>
    <div className="welcome-icons">🦁 🎨 🔢 ⭕</div>
  </div>
);

const QuestionCard = ({ question, onAnswerSelect, selectedAnswer }) => (
  <Card className="question-card shadow-lg">
    <Card.Body>
      <div className="question-header mb-3">
        <span className="difficulty-badge">{question.difficulty}</span>
        <span className="topic-badge">{question.topic}</span>
      </div>
      <h3 className="question-text mb-4">{question.question_text}</h3>
      <div className="answer-options">
        {question.options.map((option, index) => (
          <Button
            key={index}
            className={`answer-option ${
              selectedAnswer === option ? "selected" : ""
            }`}
            onClick={() => onAnswerSelect(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
    </Card.Body>
  </Card>
);

const ResultDisplay = ({ result }) => (
  <div
    className={`result-display ${result.is_correct ? "correct" : "incorrect"}`}
  >
    <div className="result-icon">{result.is_correct ? "🎉" : "💝"}</div>
    <h2 className="result-message">{result.feedback_message}</h2>
    <p className="result-explanation">{result.detailed_explanation}</p>
    {result.coins_earned > 0 && (
      <div className="coins-earned">
        <span>🪙</span>
        <span>+{result.coins_earned} coins!</span>
      </div>
    )}
    {result.level_up && (
      <div className="level-up">
        <span>🏆</span>
        <span>Level Up!</span>
      </div>
    )}
    {result.new_badge && (
      <div className="new-badge">
        <span>⭐</span>
        <span>New Badge!</span>
      </div>
    )}
  </div>
);

const BadgeDisplay = ({ badges }) => (
  <div className="badges-section">
    <h3 className="badges-title">🏅 Your Badges</h3>
    <div className="badges-grid">
      {badges.length > 0 ? (
        badges.map((badge, index) => (
          <div key={index} className="badge-item">
            <span className="badge-icon">{badge.icon}</span>
            <span className="badge-name">{badge.name}</span>
          </div>
        ))
      ) : (
        <p className="no-badges">Complete challenges to earn badges! ⭐</p>
      )}
    </div>
  </div>
);

// Enhanced Child Game Dashboard - Duolingo-style learning for kids aged 3-7
const GamifiedLearning = () => {
  const { user } = useAuth();
  const { gameStats, updateGameStats, getStreakDisplay, getLevelEmoji } =
    useGame();

  const [gameState, setGameState] = useState({
    currentQuestion: null,
    isLoading: false,
    showResult: false,
    lastResult: null,
    selectedAnswer: null,
    availableTopics: [
      { id: "animals", name: "Animals", icon: "🦁" },
      { id: "colors", name: "Colors", icon: "🎨" },
      { id: "numbers", name: "Numbers", icon: "🔢" },
      { id: "shapes", name: "Shapes", icon: "⭕" },
    ],
    questionStartTime: null,
  });

  const [selectedTopic, setSelectedTopic] = useState("animals");
  const childId = user?.id || "child_007";

  const loadChildProgress = async () => {
    try {
      const response = await gameAPI.getChildProgress(childId);

      if (response.success) {
        updateGameStats(response.data);
      }
    } catch (error) {
      console.error("Error loading child progress:", error);
    }
  };

  const startNewQuestion = async (topic = selectedTopic) => {
    setGameState((prev) => ({
      ...prev,
      isLoading: true,
      showResult: false,
      questionStartTime: Date.now(),
    }));

    try {
      const response = await gameAPI.startQuestionSession(childId, topic);

      if (response.success) {
        setGameState((prev) => ({
          ...prev,
          currentQuestion: response.data.session,
          isLoading: false,
          selectedAnswer: null,
        }));
      } else {
        setGameState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error getting question:", error);
      setGameState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Load initial data
  useEffect(() => {
    const initGame = async () => {
      await loadChildProgress();
      await startNewQuestion();
    };
    initGame();
  }, [childId, loadChildProgress, startNewQuestion]);

  const submitAnswer = async (selectedAnswer) => {
    if (!gameState.currentQuestion) return;

    setGameState((prev) => ({ ...prev, selectedAnswer, isLoading: true }));

    try {
      const response = await gameAPI.submitAnswer(
        childId,
        gameState.currentQuestion.question_id,
        selectedAnswer
      );

      if (response.success) {
        setGameState((prev) => ({
          ...prev,
          lastResult: response.data.evaluation,
          showResult: true,
          isLoading: false,
        }));

        // Update game stats in context
        updateGameStats(response.data.updated_stats);

        // Auto-proceed to next question after showing result
        setTimeout(() => {
          startNewQuestion();
        }, 3500);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setGameState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="gamified-learning">
      <Navbar />

      <Container fluid className="py-4">
        {/* Game Stats Bar */}
        <Row className="mb-4">
          <Col>
            <div className="gamification-bar d-flex justify-content-center">
              <div className="stat-item coins">
                <div className="stat-details">
                  <span className="stat-icon">🪙</span>
                  <span className="stat-value">{gameStats.coins}</span>
                  <span className="stat-label">Coins</span>
                </div>
              </div>

              <div className="stat-item level">
                <div className="stat-details">
                  <span className="stat-icon">{getLevelEmoji()}</span>
                  <span className="stat-value">Level {gameStats.level}</span>
                  <span className="stat-label">Current</span>
                </div>
              </div>

              <div className="stat-item streak">
                <div className="stat-details">
                  <span className="stat-icon">{getStreakDisplay()}</span>
                  <span className="stat-value">{gameStats.current_streak}</span>
                  <span className="stat-label">Streak</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Level Progress */}
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <div className="level-progress-section">
              <div className="progress-header">
                <span>Level Progress</span>
                <span className="coins-to-next">
                  {gameStats.coins_for_next_level > 0
                    ? `${gameStats.coins_for_next_level} coins to next level!`
                    : "Max level reached! 🏆"}
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${gameStats.level_progress_percentage}%`,
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Topic Selector */}
        <Row className="mb-4">
          <Col>
            <div className="topic-selector text-center">
              <h3 className="topic-header">🎯 Choose your adventure!</h3>
              <div className="topic-grid d-flex justify-content-center flex-wrap gap-3">
                {gameState.availableTopics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={
                      selectedTopic === topic.id ? "primary" : "outline-primary"
                    }
                    className={`topic-button ${
                      selectedTopic === topic.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      startNewQuestion(topic.id);
                    }}
                  >
                    <span className="topic-icon">{topic.icon}</span>
                    <span className="topic-name">{topic.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Main Game Area */}
        <Row>
          <Col md={10} lg={8} className="mx-auto">
            <div className="game-area">
              {gameState.isLoading ? (
                <LoadingSpinner />
              ) : gameState.showResult ? (
                <ResultDisplay result={gameState.lastResult} />
              ) : gameState.currentQuestion ? (
                <QuestionCard
                  question={gameState.currentQuestion}
                  onAnswerSelect={submitAnswer}
                  selectedAnswer={gameState.selectedAnswer}
                />
              ) : (
                <WelcomeMessage />
              )}
            </div>
          </Col>
        </Row>

        {/* Badges Section */}
        <Row className="mt-4">
          <Col md={10} lg={8} className="mx-auto">
            <BadgeDisplay badges={gameStats.badges_earned} />
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default GamifiedLearning;
