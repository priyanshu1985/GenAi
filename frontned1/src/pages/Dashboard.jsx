import { useNavigate } from "react-router-dom";


import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaFont,
  FaCalculator,
  FaPalette,
  FaShapes,
  FaMusic,
  FaGamepad,
} from "react-icons/fa";
import "../styles/dashboard.css"; // Fixed typo in filename
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const dashboardItems = [
  { title: "Alphabet", icon: <FaFont />, color: "#FF6B6B" },   // Red-Pink
  { title: "Numbers", icon: <FaCalculator />, color: "#4D96FF" }, // Sky Blue
  { title: "Colors", icon: <FaPalette />, color: "#FFD93D" },   // Sunny Yellow
  { title: "Shapes", icon: <FaShapes />, color: "#6BCB77" },    // Leaf Green
  { title: "Rhymes", icon: <FaMusic />, color: "#9254C8" },     // Purple
  { title: "Games", icon: <FaGamepad />, color: "#FF8E3C" },    // Orange
];

function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
  if (title === "Alphabet") {
    navigate("/alphabet");
  } else if (title === "Numbers") {
    navigate("/numbers");
  }
   else if (title === "Games") {
    navigate("/games");
  } else if (title === "Shapes") {
    navigate("/shapes");
  } else if (title === "Colors") {
    navigate("/colors");
  }
};


  return (
    <div className="dashboard-container">
      <Navbar />
      <Container>
        {/* Welcome Section */}
        <header className="welcome-section text-center">
          <h1 className="dashboard-title">
            <span className="wave">👋</span> Welcome, Explorer!
          </h1>
          <p className="dashboard-subtitle">Pick an adventure to start learning!</p>
        </header>

        {/* Dashboard Cards */}
        <Row className="g-4 px-2">
          {dashboardItems.map((item, index) => (
            <Col key={index} xs={6} md={4} lg={4}>
              <Card 
                className="dashboard-card" 
                style={{ "--accent-color": item.color }}
                onClick={() => handleCardClick(item.title)}
                role="button"
                tabIndex="0"
              >
                <Card.Body className="card-body-custom">
                  <div className="icon-wrapper">
                    {item.icon}
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Gamification Bar */}
        <div className="gamification-bar">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span>12 Stars</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span>Little Learner</span>
          </div>
        </div>
      </Container>
      <Footer />

      {/* Floating AI Assistant */}
      <button className="ai-assistant-btn" aria-label="Talk to me">
        <span className="pulse"></span>
        <span className="ai-emoji">🤖</span>
      </button>
    </div>
  );
}

export default Dashboard;