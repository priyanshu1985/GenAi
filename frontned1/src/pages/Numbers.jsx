import { useState, useEffect } from "react";
import "../styles/Numbers.css";
import { speakLikeKid } from "../utils/kidVoice";

const numbers = [
  { num: 1, word: "ONE", emoji: "🍎", color: "#FF6B6B" },
  { num: 2, word: "TWO", emoji: "🍌", color: "#FFD93D" },
  { num: 3, word: "THREE", emoji: "🍊", color: "#FF9F1C" },
  { num: 4, word: "FOUR", emoji: "🍓", color: "#FF4D6D" },
  { num: 5, word: "FIVE", emoji: "🍇", color: "#9254C8" },
  { num: 6, word: "SIX", emoji: "🍉", color: "#4D96FF" },
  { num: 7, word: "SEVEN", emoji: "🥭", color: "#6BCB77" },
  { num: 8, word: "EIGHT", emoji: "🍍", color: "#00C2FF" },
  { num: 9, word: "NINE", emoji: "🥝", color: "#2EC4B6" },
  { num: 10, word: "TEN", emoji: "🍒", color: "#FF8E3C" },
];

const NumbersLearning = () => {
  const [active, setActive] = useState(null);

  // Load voices safely (important for Chrome/Edge)
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleNumberClick = (num, word) => {
    speakLikeKid(word); // 👧 Kid-like voice
    setActive(num);
  };

  return (
    <div className="numbers-page">
      <div className="numbers-header">
        <h1>🔢 Let’s Count Numbers!</h1>
        <p>Tap • Listen • Count • Enjoy 🎶✨</p>
      </div>

      <div className="numbers-grid">
        {numbers.map((item) => (
          <div
            key={item.num}
            className={`number-card ${active === item.num ? "active" : ""}`}
            style={{ "--card-color": item.color }}
            onClick={() => handleNumberClick(item.num, item.word)}
          >
            {/* Number bubble */}
            <div className="number-bubble">{item.num}</div>

            {/* Word */}
            <div className="number-word">{item.word}</div>

            {/* Objects for counting */}
            <div className="objects-row">
              {Array(item.num)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className="object-emoji"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {item.emoji}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumbersLearning;
