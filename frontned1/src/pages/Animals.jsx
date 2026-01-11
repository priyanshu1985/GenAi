import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaVolumeUp, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Animals = () => {
  const navigate = useNavigate();
  const [currentAnimal, setCurrentAnimal] = useState(null);

  const animals = [
    {
      name: "Lion",
      hindi: "शेर",
      emoji: "🦁",
      sound: "Roar!",
      color: "#FFA500",
      description: "The lion is the king of the jungle!",
    },
    {
      name: "Elephant",
      hindi: "हाथी",
      emoji: "🐘",
      sound: "Trumpet!",
      color: "#808080",
      description: "Elephants are the largest land animals!",
    },
    {
      name: "Cat",
      hindi: "बिल्ली",
      emoji: "🐱",
      sound: "Meow!",
      color: "#FF69B4",
      description: "Cats are cute and cuddly pets!",
    },
    {
      name: "Dog",
      hindi: "कुत्ता",
      emoji: "🐶",
      sound: "Woof!",
      color: "#8B4513",
      description: "Dogs are loyal and friendly companions!",
    },
    {
      name: "Bird",
      hindi: "पक्षी",
      emoji: "🐦",
      sound: "Chirp!",
      color: "#87CEEB",
      description: "Birds can fly high in the sky!",
    },
    {
      name: "Fish",
      hindi: "मछली",
      emoji: "🐠",
      sound: "Blub!",
      color: "#00CED1",
      description: "Fish live and swim in water!",
    },
    {
      name: "Rabbit",
      hindi: "खरगोश",
      emoji: "🐰",
      sound: "Hop!",
      color: "#F5F5DC",
      description: "Rabbits hop and love to eat carrots!",
    },
    {
      name: "Bear",
      hindi: "भालू",
      emoji: "🐻",
      sound: "Growl!",
      color: "#8B4513",
      description: "Bears are big and strong animals!",
    },
  ];

  const playSound = (animal) => {
    setCurrentAnimal(animal);
    // Create a speech utterance for the animal name
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${animal.name} in Hindi is ${animal.hindi}. ${animal.sound}`
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
                  🦁 Learn About Animals 🐘
                </h1>
                <p className="text-muted mb-0">
                  Click on any animal to hear its name and sound!
                </p>
              </div>
            </Col>
          </Row>

          {/* Animals Grid */}
          <Row className="g-4">
            {animals.map((animal, index) => (
              <Col key={index} xs={6} md={4} lg={3}>
                <Card
                  className="h-100 border-0 shadow-sm animal-card"
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
                  onClick={() => playSound(animal)}
                >
                  <Card.Body className="text-center p-3">
                    <div
                      className="animal-emoji mb-3"
                      style={{
                        fontSize: "4rem",
                        backgroundColor: animal.color,
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
                      {animal.emoji}
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{animal.name}</h5>
                    <p className="text-primary fw-semibold mb-2">
                      {animal.hindi}
                    </p>
                    <p className="text-muted small mb-3">
                      {animal.description}
                    </p>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(animal);
                      }}
                    >
                      <FaVolumeUp className="me-1" />
                      Play Sound
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Current Animal Display */}
          {currentAnimal && (
            <Row className="mt-4">
              <Col>
                <div className="text-center p-4 bg-white rounded-3 shadow">
                  <h3 className="fw-bold text-success mb-2">
                    {currentAnimal.emoji} {currentAnimal.name} -{" "}
                    {currentAnimal.hindi}
                  </h3>
                  <p className="text-muted mb-2">{currentAnimal.description}</p>
                  <p className="text-primary fw-bold">
                    Sound: {currentAnimal.sound}
                  </p>
                </div>
              </Col>
            </Row>
          )}

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

export default Animals;
