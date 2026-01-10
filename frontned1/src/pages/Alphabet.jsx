import { useState } from "react";
import "../styles/Alphabet.css";
import { speakLikeKid } from "../utils/kidVoice";

const alphabets = [
  { letter: "A", word: "Apple", emoji: "🍎" },
  { letter: "B", word: "Ball", emoji: "⚽" },
  { letter: "C", word: "Cat", emoji: "🐱" },
  { letter: "D", word: "Dog", emoji: "🐶" },
  { letter: "E", word: "Elephant", emoji: "🐘" },
  { letter: "F", word: "Fish", emoji: "🐟" },
  { letter: "G", word: "Grapes", emoji: "🍇" },
  { letter: "H", word: "Hen", emoji: "🐔" },
  { letter: "I", word: "Ice-cream", emoji: "🍦" },
  { letter: "J", word: "Jug", emoji: "🏺" },
  { letter: "K", word: "Kite", emoji: "🪁" },
  { letter: "L", word: "Lion", emoji: "🦁" },
  { letter: "M", word: "Mango", emoji: "🥭" },
  { letter: "N", word: "Nest", emoji: "🪺" },
  { letter: "O", word: "Orange", emoji: "🍊" },
  { letter: "P", word: "Parrot", emoji: "🦜" },
  { letter: "Q", word: "Queen", emoji: "👑" },
  { letter: "R", word: "Rabbit", emoji: "🐰" },
  { letter: "S", word: "Sun", emoji: "☀️" },
  { letter: "T", word: "Tiger", emoji: "🐯" },
  { letter: "U", word: "Umbrella", emoji: "☂️" },
  { letter: "V", word: "Van", emoji: "🚐" },
  { letter: "W", word: "Watch", emoji: "⌚" },
  { letter: "X", word: "Xylophone", emoji: "🎵" },
  { letter: "Y", word: "Yak", emoji: "🐃" },
  { letter: "Z", word: "Zebra", emoji: "🦓" },
];

const AlphabetLearning = () => {
  const [active, setActive] = useState(null);

  const speak = (letter, word) => {
  speakLikeKid(`${letter} for ${word}`);
  setActive(letter);
};

  return (
    <div className="alphabet-page">
      <h1 className="alphabet-title">🔤 Learn Alphabets</h1>
      <p className="alphabet-subtitle">Tap a letter and listen 👂✨</p>

      <div className="alphabet-grid">
        {alphabets.map((item) => (
          <button
            key={item.letter}
            className={`alphabet-card ${active === item.letter ? "active" : ""}`}
            onClick={() => speak(item.letter, item.word)}
          >
            <div className="alphabet-letter">{item.letter}</div>
            <div className="alphabet-emoji">{item.emoji}</div>
            <div className="alphabet-word">{item.word}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlphabetLearning;
