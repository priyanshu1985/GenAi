import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaFont,
  FaCalculator,
  FaPalette,
  FaShapes,
  FaMusic,
  FaGamepad,
  FaStar,
  FaCheck,
} from "react-icons/fa";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Translated dashboard items
  const dashboardItems = [
    {
      title: t("dashboard.alphabet", "Alphabet"),
      icon: <FaFont />,
      color: "#58CC02", // Green
      path: "/alphabet",
      progress: 75,
      locked: false,
    },
    {
      title: t("dashboard.numbers", "Numbers"),
      icon: <FaCalculator />,
      color: "#1CB0F6", // Blue
      path: "/numbers",
      progress: 50,
      locked: false,
    },
    {
      title: t("dashboard.colors", "Colors"),
      icon: <FaPalette />,
      color: "#FF9600", // Orange
      path: "/colors",
      progress: 30,
      locked: false,
    },
    {
      title: t("dashboard.shapes", "Shapes"),
      icon: <FaShapes />,
      color: "#CE82FF", // Purple
      path: "/shapes",
      progress: 0,
      locked: false,
    },
    {
      title: t("dashboard.rhymes", "Rhymes"),
      icon: <FaMusic />,
      color: "#FF86D0", // Pink
      path: "/rhymes",
      progress: 0,
      locked: true,
    },
    {
      title: t("dashboard.games", "Games"),
      icon: <FaGamepad />,
      color: "#FF4B4B", // Red
      path: "/games",
      progress: 25,
      locked: false,
    },
  ];

  const handleCardClick = (item) => {
    if (!item.locked) {
      navigate(item.path);
    }
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

        {/* Stats Section */}
        <div className="gamification-bar">
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span>
              {t("dashboard.streak", "{{days}} Day Streak", { days: 3 })}
            </span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">
              <FaStar color="#FFC800" />
            </span>
            <span>{t("dashboard.xp", "{{xp}} XP", { xp: 120 })}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span>{t("dashboard.level", "Level {{level}}", { level: 3 })}</span>
          </div>
        </div>
      </Container>

      <Footer />

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
