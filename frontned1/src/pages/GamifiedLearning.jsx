import { useState } from "react";
import "../styles/Global.css";

// LEVEL 1 QUESTIONS (10)
const level1Questions = [
  { q: "Which number comes after 1?", options: ["1", "2", "3"], answer: "2" },
  { q: "Which letter comes after A?", options: ["A", "B", "C"], answer: "B" },
  { q: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
  { q: "Which number comes before 5?", options: ["3", "4", "6"], answer: "4" },
  { q: "Which letter comes before C?", options: ["A", "B", "D"], answer: "B" },
  { q: "Which color is the sun? ☀️", options: ["Blue", "Yellow", "Green"], answer: "Yellow" },
  { q: "How many eyes do we have? 👀", options: ["1", "2", "3"], answer: "2" },
  { q: "Which shape is a ball? ⚽", options: ["Circle", "Square", "Triangle"], answer: "Circle" },
  { q: "Which animal says Moo? 🐮", options: ["Dog", "Cat", "Cow"], answer: "Cow" },
  { q: "How many fingers are on one hand? ✋", options: ["3", "5", "10"], answer: "5" },
];

// LEVEL 2 QUESTIONS (20)
const level2Questions = [
  { q: "What color is the sky on a clear day?", options: ["Blue", "Red", "Green"], answer: "Blue" },
  { q: "Which animal says Meow? 🐱", options: ["Dog", "Cat", "Cow"], answer: "Cat" },
  { q: "How many legs does a spider have?", options: ["6", "8", "4"], answer: "8" },
  { q: "Which shape is a rectangle?", options: ["Square", "Rectangle", "Circle"], answer: "Rectangle" },
  { q: "What is 5 - 3?", options: ["2", "3", "5"], answer: "2" },
  { q: "Which planet do we live on?", options: ["Mars", "Earth", "Venus"], answer: "Earth" },
  { q: "Which fruit is yellow?", options: ["Apple", "Banana", "Grapes"], answer: "Banana" },
  { q: "Which animal says Woof? 🐶", options: ["Dog", "Cat", "Cow"], answer: "Dog" },
  { q: "What is 3 + 3?", options: ["5", "6", "7"], answer: "6" },
  { q: "Which shape has 3 sides?", options: ["Triangle", "Square", "Circle"], answer: "Triangle" },
  { q: "Which day comes after Monday?", options: ["Sunday", "Tuesday", "Wednesday"], answer: "Tuesday" },
  { q: "Which number comes after 9?", options: ["8", "9", "10"], answer: "10" },
  { q: "Which season is cold?", options: ["Summer", "Winter", "Spring"], answer: "Winter" },
  { q: "Which color is an apple?", options: ["Red", "Blue", "Yellow"], answer: "Red" },
  { q: "What is 4 + 5?", options: ["8", "9", "10"], answer: "9" },
  { q: "Which animal has a trunk?", options: ["Elephant", "Lion", "Horse"], answer: "Elephant" },
  { q: "Which shape has 4 equal sides?", options: ["Rectangle", "Square", "Triangle"], answer: "Square" },
  { q: "Which letter comes after D?", options: ["E", "F", "G"], answer: "E" },
  { q: "How many eyes does a bee have?", options: ["2", "5", "6"], answer: "5" },
  { q: "Which fruit is green?", options: ["Banana", "Apple", "Mango"], answer: "Apple" },
];

// LEVEL 3 QUESTIONS (40)
const level3Questions = [
  { q: "What is 10 - 4?", options: ["5", "6", "7"], answer: "6" },
  { q: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Earth"], answer: "Mars" },
  { q: "How many hours are in a day?", options: ["12", "24", "36"], answer: "24" },
  { q: "What color is grass?", options: ["Green", "Blue", "Red"], answer: "Green" },
  { q: "What is 7 + 8?", options: ["14", "15", "16"], answer: "15" },
  { q: "Which animal says Neigh? 🐴", options: ["Horse", "Dog", "Cat"], answer: "Horse" },
  { q: "Which shape has no corners?", options: ["Circle", "Square", "Triangle"], answer: "Circle" },
  { q: "Which number comes before 20?", options: ["18", "19", "21"], answer: "19" },
  { q: "Which fruit is red?", options: ["Apple", "Banana", "Grapes"], answer: "Apple" },
  { q: "Which color is used for stop signs?", options: ["Green", "Red", "Yellow"], answer: "Red" },
  { q: "What is 12 + 5?", options: ["16", "17", "18"], answer: "17" },
  { q: "Which animal has stripes?", options: ["Tiger", "Lion", "Elephant"], answer: "Tiger" },
  { q: "Which day comes after Friday?", options: ["Saturday", "Sunday", "Monday"], answer: "Saturday" },
  { q: "How many legs does a dog have?", options: ["2", "4", "6"], answer: "4" },
  { q: "Which is a vegetable?", options: ["Carrot", "Apple", "Mango"], answer: "Carrot" },
  { q: "Which planet is closest to the Sun?", options: ["Mercury", "Venus", "Earth"], answer: "Mercury" },
  { q: "What is 15 - 7?", options: ["7", "8", "9"], answer: "8" },
  { q: "Which color is a lemon?", options: ["Yellow", "Green", "Red"], answer: "Yellow" },
  { q: "Which animal says Baa? 🐑", options: ["Sheep", "Cow", "Dog"], answer: "Sheep" },
  { q: "Which shape has 4 sides?", options: ["Square", "Triangle", "Circle"], answer: "Square" },
  { q: "What is 6 + 6?", options: ["11", "12", "13"], answer: "12" },
  { q: "Which fruit is yellow?", options: ["Banana", "Apple", "Grapes"], answer: "Banana" },
  { q: "Which is a flying animal?", options: ["Bird", "Dog", "Cat"], answer: "Bird" },
  { q: "What is 20 - 9?", options: ["10", "11", "12"], answer: "11" },
  { q: "Which color is the sky during sunset?", options: ["Red", "Blue", "Green"], answer: "Red" },
  { q: "Which animal lives in water?", options: ["Fish", "Dog", "Cat"], answer: "Fish" },
  { q: "Which number comes after 50?", options: ["49", "50", "51"], answer: "51" },
  { q: "What is 9 + 7?", options: ["15", "16", "17"], answer: "16" },
  { q: "Which animal has a long neck?", options: ["Giraffe", "Elephant", "Tiger"], answer: "Giraffe" },
  { q: "Which shape has 6 sides?", options: ["Pentagon", "Hexagon", "Triangle"], answer: "Hexagon" },
  { q: "Which fruit is purple?", options: ["Grapes", "Apple", "Banana"], answer: "Grapes" },
  { q: "Which color is used for school buses?", options: ["Yellow", "Red", "Blue"], answer: "Yellow" },
  { q: "Which number comes before 100?", options: ["98", "99", "101"], answer: "99" },
  { q: "Which animal is known as King of Jungle?", options: ["Lion", "Tiger", "Elephant"], answer: "Lion" },
  { q: "What is 14 + 6?", options: ["19", "20", "21"], answer: "20" },
  { q: "Which shape is 3D?", options: ["Cube", "Triangle", "Circle"], answer: "Cube" },
  { q: "Which planet is farthest from the Sun?", options: ["Neptune", "Mars", "Earth"], answer: "Neptune" },
  { q: "Which animal says Oink? 🐷", options: ["Pig", "Dog", "Cow"], answer: "Pig" },
  { q: "What is 18 - 9?", options: ["8", "9", "10"], answer: "9" },
  { q: "Which fruit is orange?", options: ["Orange", "Apple", "Banana"], answer: "Orange" },
  { q: "Which number comes after 100?", options: ["100", "101", "102"], answer: "101" },
];

const GamifiedLearning = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevel, setCompletedLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [showLevelSummary, setShowLevelSummary] = useState(false);

  // Get questions for current level
  let questions = [];
  if (currentLevel === 1) questions = level1Questions;
  else if (currentLevel === 2) questions = level2Questions;
  else if (currentLevel === 3) questions = level3Questions;

  // Initialize selectedOptions when level changes
  if (selectedOptions.length !== questions.length) {
    setSelectedOptions(Array(questions.length).fill(null));
    setScore(0);
    setProgress(0);
    setShowLevelSummary(false);
  }

  const handleOptionClick = (opt, index) => {
    if (selectedOptions[index]) return;

    // Speak option
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(opt);
    utterance.rate = 0.9;
    synth.speak(utterance);

    const newSelected = [...selectedOptions];
    newSelected[index] = opt;
    setSelectedOptions(newSelected);

    if (opt === questions[index].answer) setScore((s) => s + 1);

    const answeredCount = newSelected.filter(Boolean).length;
    setProgress((answeredCount / questions.length) * 100);

    if (answeredCount === questions.length) {
      setShowLevelSummary(true);
      setCompletedLevel((prev) => Math.max(prev, currentLevel));
    }
  };

  return (
    <>
      <div className="game-header">
        <div className="header-left">🧸⭐</div>
        <div className="header-center">
          <div className="header-title">🌈 Fun AI Anganwadi Learning 🎈</div>
          <div className="header-subtitle">🎵 Learn • Play • Grow 🌱</div>
        </div>
        <div className="header-right">🎨🧩</div>
      </div>

      <div className="game-layout">
        {/* LEFT QUIZ */}
        <div className="quiz-section">
          {questions.map((item, index) => (
            <div className="question-card" key={index}>
              <h3 className="question-text">
                Question {index + 1}: {item.q}
              </h3>
              <div className="options">
                {item.options.map((opt, i) => {
                  let optionClass = "option-btn";
                  if (selectedOptions[index]) {
                    if (opt === item.answer) optionClass += " correct";
                    else if (opt === selectedOptions[index]) optionClass += " wrong";
                  }
                  return (
                    <button key={i} className={optionClass} onClick={() => handleOptionClick(opt, index)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {showLevelSummary && (
            <div className="question-card">
              <h3>🎉 Level {currentLevel} Completed!</h3>
              <p>
                Your Score: {score} / {questions.length}
              </p>
              <p>Badge Earned:</p>
              <div className="badge-row">
                {score === questions.length ? (
                  <span className="badge glow active-badge">⭐⭐⭐</span>
                ) : score >= Math.ceil(questions.length / 2) ? (
                  <span className="badge glow active-badge">⭐⭐</span>
                ) : (
                  <span className="badge glow active-badge">⭐</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="side-panel">
          {/* PROGRESS */}
          <div className="side-card">
            <h3>📊 Progress</h3>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <p>{Math.round(progress)}% Completed</p>
          </div>

          {/* BADGES */}
          <div className="side-card">
            <h3>🏅 Badges</h3>
            <div className="badge-row">
              {score === questions.length ? (
                <span className="badge glow active-badge">🏆</span>
              ) : score >= Math.ceil(questions.length / 2) ? (
                <span className="badge glow active-badge">🌱</span>
              ) : (
                <span className="badge glow active-badge">⭐</span>
              )}
            </div>
          </div>

          {/* LEVELS */}
         <div className="side-card">
  <h3>🧠 Levels</h3>
  <div className="levels">
    {[1, 2, 3].map((l) => (
      <button
        key={l}
        onClick={() => l <= completedLevel + 1 && setCurrentLevel(l)}
        disabled={l > completedLevel + 1}
        className={`level-btn ${
          l <= completedLevel ? "completed" : l <= completedLevel + 1 ? "active" : "locked"
        }`}
      >
        Level {l}
      </button>
    ))}
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default GamifiedLearning;
