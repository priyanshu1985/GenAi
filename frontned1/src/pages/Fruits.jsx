import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaVolumeUp, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Fruits = () => {
  const navigate = useNavigate();
  const [currentFruit, setCurrentFruit] = useState(null);

  const fruits = [
    {
      name: "Apple",
      hindi: "सेब",
      emoji: "🍎",
      color: "#FF4444",
      description: "Apples are red, sweet, and crunchy!",
      taste: "Sweet and crispy",
    },
    {
      name: "Banana",
      hindi: "केला",
      emoji: "🍌",
      color: "#FFFF00",
      description: "Bananas are yellow and full of energy!",
      taste: "Sweet and soft",
    },
    {
      name: "Orange",
      hindi: "संतरा",
      emoji: "🍊",
      color: "#FFA500",
      description: "Oranges are juicy and full of Vitamin C!",
      taste: "Tangy and juicy",
    },
    {
      name: "Grapes",
      hindi: "अंगूर",
      emoji: "🍇",
      color: "#8A2BE2",
      description: "Grapes are small, sweet, and grow in bunches!",
      taste: "Sweet and juicy",
    },
    {
      name: "Strawberry",
      hindi: "स्ट्रॉबेरी",
      emoji: "🍓",
      color: "#FF1493",
      description: "Strawberries are red, sweet, and have tiny seeds!",
      taste: "Sweet and tangy",
    },
    {
      name: "Mango",
      hindi: "आम",
      emoji: "🥭",
      color: "#FFB347",
      description: "Mangoes are the king of fruits!",
      taste: "Very sweet and tropical",
    },
    {
      name: "Pineapple",
      hindi: "अनानास",
      emoji: "🍍",
      color: "#FFFF99",
      description: "Pineapples are tropical and spiky outside!",
      taste: "Sweet and tangy",
    },
    {
      name: "Watermelon",
      hindi: "तरबूज",
      emoji: "🍉",
      color: "#FF6347",
      description: "Watermelons are big, juicy, and refreshing!",
      taste: "Sweet and watery",
    },
  ];

  const playSound = (fruit) => {
    setCurrentFruit(fruit);
    // Create a speech utterance for the fruit name
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${fruit.name} in Hindi is ${fruit.hindi}. ${fruit.description}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Navbar />

      <main className="flex-grow-1">
        <Container className="py-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <div className="text-center p-4 bg-white rounded-3 shadow">
                <h1 className="fw-bold text-primary mb-2">
                  🍎 Learn About Fruits 🍌
                </h1>
                <p className="text-muted mb-0">
                  Click on any fruit to learn about it!
                </p>
              </div>
            </Col>
          </Row>

          {/* Fruits Grid */}
          <Row className="g-4">
            {fruits.map((fruit, index) => (
              <Col key={index} xs={6} md={4} lg={3}>
                <Card
                  className="h-100 border-0 shadow-sm fruit-card"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    borderRadius: "20px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 30px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.1)";
                  }}
                  onClick={() => playSound(fruit)}
                >
                  <Card.Body className="text-center p-3">
                    <div
                      className="fruit-emoji mb-3"
                      style={{
                        fontSize: "4rem",
                        backgroundColor: fruit.color,
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      {fruit.emoji}
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{fruit.name}</h5>
                    <p className="text-primary fw-semibold mb-2">
                      {fruit.hindi}
                    </p>
                    <p className="text-muted small mb-2">{fruit.description}</p>
                    <p className="text-success small mb-3">
                      <strong>Taste:</strong> {fruit.taste}
                    </p>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(fruit);
                      }}
                    >
                      <FaVolumeUp className="me-1" />
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Current Fruit Display */}
          {currentFruit && (
            <Row className="mt-4">
              <Col>
                <div className="text-center p-4 bg-white rounded-3 shadow">
                  <h3 className="fw-bold text-success mb-2">
                    {currentFruit.emoji} {currentFruit.name} -{" "}
                    {currentFruit.hindi}
                  </h3>
                  <p className="text-muted mb-2">{currentFruit.description}</p>
                  <p className="text-primary fw-bold">
                    Taste: {currentFruit.taste}
                  </p>
                </div>
              </Col>
            </Row>
          )}

          {/* Fun Facts */}
          <Row className="mt-4">
            <Col>
              <div className="text-center p-4 bg-light rounded-3 shadow-sm">
                <h4 className="fw-bold text-success mb-3">
                  🌟 Fun Fruit Facts!
                </h4>
                <Row>
                  <Col md={4} className="mb-2">
                    <p className="mb-0">
                      🍎 Fruits give us energy and vitamins!
                    </p>
                  </Col>
                  <Col md={4} className="mb-2">
                    <p className="mb-0">🍌 Eating fruits keeps us healthy!</p>
                  </Col>
                  <Col md={4} className="mb-2">
                    <p className="mb-0">
                      🍇 Fruits come in many colors and shapes!
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* Navigation */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill px-4"
                onClick={() => navigate("/")}
              >
                <FaHome className="me-2" />
                Back to Dashboard
              </Button>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Fruits;
