import { useState } from "react";
import "../styles/Shapes.css";

const shapes = [
  { name: "Circle", emoji: "⚪", color: "#ffeb3b" },
  { name: "Square", emoji: "🟩", color: "#ffd54f" },
  { name: "Triangle", emoji: "🔺", color: "#ffca28" },
  { name: "Star", emoji: "⭐", color: "#fff176" },
  { name: "Heart", emoji: "❤️", color: "#ff8a65" },
  { name: "Diamond", emoji: "💎", color: "#4dd0e1" },
];

const ShapesLearning = () => {
  const [selectedShapes, setSelectedShapes] = useState([]);

  const handleShapeClick = (shape) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(shape.name);
    utterance.rate = 0.9;
    synth.speak(utterance);

    if (!selectedShapes.includes(shape.name)) {
      setSelectedShapes([...selectedShapes, shape.name]);
    }
  };

  const progress = (selectedShapes.length / shapes.length) * 100;

  return (
    <div>
      <div className="shapes-header">
        <div className="header-left">🧸✨</div>
        <div className="header-center">
          <div className="header-title">🌈 Fun Shapes Learning 🎨</div>
          <div className="header-subtitle">🖌️ Tap • Learn • Enjoy 🥳</div>
        </div>
        <div className="header-right">🎈🧩</div>
      </div>

      <div className="shapes-layout">
        <div className="shapes-section">
          <div className="shape-card">
            <h3>Tap a shape to learn its name:</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {shapes.map((shape, index) => (
                <button
                  key={index}
                  className={`shape-btn ${selectedShapes.includes(shape.name) ? "correct" : ""}`}
                  style={{ backgroundColor: shape.color }}
                  onClick={() => handleShapeClick(shape)}
                >
                  {shape.emoji} <br /> {shape.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shapes-side">
          <div className="side-card">
            <h3>📊 Progress</h3>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <p>{Math.round(progress)}% Completed</p>
          </div>

          <div className="side-card">
            <h3>🏅 Badges</h3>
            <div className="badge-row">
              {selectedShapes.length === shapes.length ? (
                <span className="badge glow active-badge">🏆</span>
              ) : selectedShapes.length >= Math.ceil(shapes.length / 2) ? (
                <span className="badge glow active-badge">🌱</span>
              ) : (
                <span className="badge glow active-badge">⭐</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapesLearning;
