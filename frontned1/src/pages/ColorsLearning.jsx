import React, { useState, useEffect, useMemo } from "react";
import "../styles/Colors.css";

/* ---------------- DATA ---------------- */
const quizData = [
  { color: "Red", emoji: "🍎", hex: "#f44336" },
  { color: "Green", emoji: "🍃", hex: "#4caf50" },
  { color: "Yellow", emoji: "🐥", hex: "#ffeb3b" },
  { color: "Blue", emoji: "🌊", hex: "#2196f3" },
  { color: "Purple", emoji: "🍇", hex: "#9c27b0" },
  { color: "Orange", emoji: "🥕", hex: "#ff9800" },
  { color: "Pink", emoji: "🌸", hex: "#e91e63" },
  { color: "Black", emoji: "🌙", hex: "#000000" },
];

const allColors = quizData.map(({ color, emoji, hex }) => ({
  name: color,
  emoji,
  hex,
}));

const objectsToColor = [
  { name: "Sky", id: "sky", defaultColor: "#87ceeb", colorName: "Blue" },
  { name: "Cow", id: "cow", defaultColor: "#ffffff", colorName: "Black" },
  { name: "Sun", id: "sun", defaultColor: "#fff176", colorName: "Yellow" },
  { name: "Tree", id: "tree", defaultColor: "#a5d6a7", colorName: "Green" },
  { name: "Human", id: "human", defaultColor: "#ffe0b2", colorName: "Pink" },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/* ---------------- COMPONENT ---------------- */
const ColorsLearning = () => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [stars, setStars] = useState(0);
  const [emojiRain, setEmojiRain] = useState([]);
  const [bg, setBg] = useState("#fffde7");
  const [mode, setMode] = useState("learn"); // learn | paint
  const [paintColor, setPaintColor] = useState("#000");
  const [objectColors, setObjectColors] = useState(
    objectsToColor.reduce((acc, obj) => {
      acc[obj.id] = obj.defaultColor;
      return acc;
    }, {})
  );

  const shuffledColors = useMemo(() => shuffle(allColors), [index]);

  /* 🔊 Speech for learn mode */
  useEffect(() => {
    if (mode === "learn") {
      const utter = new SpeechSynthesisUtterance(
        `Which color is this ${quizData[index].emoji}?`
      );
      utter.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }
  }, [index, mode]);

  /* 🎯 Answer Handler for learn mode */
  const handleAnswer = (name, hex) => {
    const correct = quizData[index].color;

    if (name === correct) {
      setFeedback("🎉 Awesome!");
      setStars((s) => s + 1);
      setBg(hex);

      const rain = Array.from({ length: 12 }, () => ({
        emoji: quizData[index].emoji,
        left: Math.random() * 90,
      }));
      setEmojiRain(rain);

      speechSynthesis.speak(
        new SpeechSynthesisUtterance("Yay! You got it right!")
      );

      setTimeout(() => {
        setIndex((i) => (i + 1) % quizData.length);
        setFeedback("");
        setEmojiRain([]);
        setBg("#fffde7");
      }, 1800);
    } else {
      setFeedback("❌ Try again!");
      speechSynthesis.speak(new SpeechSynthesisUtterance("Oops! Try again!"));
    }
  };

  /* 🎨 Paint Object Handler */
  const paintObject = (id, requiredColorHex) => {
    if (paintColor === requiredColorHex) {
      setObjectColors((prev) => ({ ...prev, [id]: paintColor }));
    } else {
      alert(
        `Please use ${objectsToColor.find((obj) => obj.id === id).colorName} color!`
      );
    }
  };

  return (
    <div className="colors-page" style={{ backgroundColor: bg }}>
      <h1 className="colors-header">🎨 Fun Color World</h1>

      {/* ⭐ Stars */}
      <div className="star-bar">⭐ Stars: {stars}</div>

      {/* 🧭 Mode Switch */}
      <div className="mode-switch">
        <button onClick={() => setMode("learn")}>🎓 Learn</button>
        <button onClick={() => setMode("paint")}>🎨 Paint</button>
      </div>

      {/* ---------------- LEARN MODE ---------------- */}
      {mode === "learn" && (
        <>
          <div className="quiz-section">
            <div className="quiz-emoji">{quizData[index].emoji}</div>
            <h2>Which color is this?</h2>
          </div>

          <div className="colors-grid">
            {shuffledColors.map((c) => (
              <div
                key={c.name}
                className="color-card"
                style={{ backgroundColor: c.hex }}
                onClick={() => handleAnswer(c.name, c.hex)}
              >
                {c.emoji} – {c.name}
              </div>
            ))}
          </div>

          {feedback && <div className="feedback">{feedback}</div>}
        </>
      )}

      {/* ---------------- PAINT MODE ---------------- */}
      {mode === "paint" && (
        <>
          <h2>🎨 Color the World</h2>

          {/* 🎨 Color Picker */}
          <div className="paint-colors">
            {allColors.map((c) => (
              <span
                key={c.name}
                className="paint-color"
                style={{ background: c.hex }}
                onClick={() => setPaintColor(c.hex)}
                title={c.name}
              />
            ))}
          </div>

          {/* Main Coloring Card */}
          <div className="coloring-card">
            <div className="color-objects">
              {objectsToColor.map((obj) => (
                <div
                  key={obj.id}
                  className="color-object"
                  style={{ backgroundColor: objectColors[obj.id] }}
                  onClick={() =>
                    paintObject(
                      obj.id,
                      allColors.find((c) => c.name === obj.colorName).hex
                    )
                  }
                >
                  <span className="object-name">{obj.colorName}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 🐻 Mascot */}
      <div className="mascot">
        🐻
        <span className="mascot-text">
          {feedback || "Let's play with colors!"}
        </span>
      </div>

      {/* 🎊 Emoji Rain */}
      {emojiRain.map((e, i) => (
        <span key={i} className="emoji-fly" style={{ left: `${e.left}%` }}>
          {e.emoji}
        </span>
      ))}
    </div>
  );
};

export default ColorsLearning;
