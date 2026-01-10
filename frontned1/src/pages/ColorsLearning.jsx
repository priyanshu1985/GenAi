import React, { useState, useEffect } from "react";
import "../styles/Colors.css";

// 15 Colors
const colors = [
  { name: "Red", hex: "#f44336", emoji: "🟥" },
  { name: "Green", hex: "#4caf50", emoji: "🟩" },
  { name: "Blue", hex: "#2196f3", emoji: "🟦" },
  { name: "Yellow", hex: "#ffeb3b", emoji: "🟨" },
  { name: "Purple", hex: "#9c27b0", emoji: "🟪" },
  { name: "Orange", hex: "#ff9800", emoji: "🟧" },
  { name: "Pink", hex: "#e91e63", emoji: "💖" },
  { name: "Brown", hex: "#795548", emoji: "🟫" },
  { name: "Gray", hex: "#9e9e9e", emoji: "⬜" },
  { name: "Black", hex: "#000000", emoji: "⬛" },
  { name: "White", hex: "#ffffff", emoji: "⚪" },
  { name: "Cyan", hex: "#00bcd4", emoji: "🔵" },
  { name: "Lime", hex: "#cddc39", emoji: "🟢" },
  { name: "Magenta", hex: "#ff00ff", emoji: "🎀" },
  { name: "Teal", hex: "#008080", emoji: "🟦" },
];

// 15 Quiz objects with images and correct color
const quizObjects = [
  { img: "/images/sky.png", question: "What is the color of the sky?", color: "Blue" },
  { img: "/images/apple.png", question: "What is the color of this apple?", color: "Red" },
  { img: "/images/carrot.png", question: "What is the color of this carrot?", color: "Orange" },
  { img: "/images/lemon.png", question: "What is the color of this lemon?", color: "Yellow" },
  { img: "/images/grape.png", question: "What is the color of these grapes?", color: "Purple" },
  { img: "/images/leaf.png", question: "What is the color of this leaf?", color: "Green" },
  { img: "/images/cherry.png", question: "What is the color of this cherry?", color: "Red" },
  { img: "/images/eggplant.png", question: "What is the color of this eggplant?", color: "Purple" },
  { img: "/images/coal.png", question: "What is the color of coal?", color: "Black" },
  { img: "/images/snow.png", question: "What is the color of snow?", color: "White" },
  { img: "/images/sky_blue.png", question: "What is the color of the clear sky?", color: "Cyan" },
  { img: "/images/lime.png", question: "What is the color of lime?", color: "Lime" },
  { img: "/images/pink_flower.png", question: "What is the color of this flower?", color: "Pink" },
  { img: "/images/bread.png", question: "What is the color of bread?", color: "Brown" },
  { img: "/images/magenta_object.png", question: "What is this color?", color: "Magenta" },
];

const ColorsLearning = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Play question voice when quiz changes
  useEffect(() => {
    if (!quizObjects[currentQuiz]) return;

    const speech = new SpeechSynthesisUtterance(quizObjects[currentQuiz].question);
    speechSynthesis.speak(speech);

    // Reset feedback safely
    const timer = setTimeout(() => setFeedback(""), 0);
    return () => clearTimeout(timer);
  }, [currentQuiz]);

  // Handle color selection
  const handleColorClick = (colorName) => {
    if (!quizObjects[currentQuiz]) return;

    const correctColor = quizObjects[currentQuiz].color;

    if (colorName.toLowerCase() === correctColor.toLowerCase()) {
      setFeedback("🎉 Correct! Well done!");

      // Safe audio playback
      try {
        const audio = new Audio(`/sounds/${colorName}.mp3`);
        audio.play();
      } catch (err) {
        console.warn("Audio playback failed:", err);
      }

      // Next quiz after 1.5s
      setTimeout(() => {
        setCurrentQuiz((prev) => (prev + 1) % quizObjects.length);
      }, 1500);
    } else {
      setFeedback("❌ Oops! Try again!");
    }
  };

  return (
    <div className="colors-page">
      <h1 className="colors-header">🎨 Learn Colors with Fun! 🌈</h1>

      <div className="quiz-section">
        {quizObjects[currentQuiz] && (
          <>
            <img
              src={quizObjects[currentQuiz].img}
              alt="Quiz Object"
              className="quiz-image"
            />
            <h2 className="quiz-question">{quizObjects[currentQuiz].question}</h2>
          </>
        )}
      </div>

      <div className="colors-grid">
        {colors.map((color) => (
          <div
            key={color.name}
            className="color-card"
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorClick(color.name)}
          >
            <span className="color-emoji">{color.emoji}</span>
            <span className="color-name">{color.name}</span>
          </div>
        ))}
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes("Correct") ? "correct" : "wrong"}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default ColorsLearning;
