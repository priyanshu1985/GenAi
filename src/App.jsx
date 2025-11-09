import React, { useState, useEffect, useMemo, useRef } from "react";

// --- Data for Learning Modules ---
const alphabetData = [
  { letter: "A", word: "Apple", emoji: "🍎" },
  { letter: "B", word: "Ball", emoji: "⚽" },
  { letter: "C", word: "Cat", emoji: "🐱" },
  { letter: "D", word: "Dog", emoji: "🐶" },
  { letter: "E", word: "Elephant", emoji: "🐘" },
  { letter: "F", word: "Fish", emoji: "🐠" },
  { letter: "G", word: "Goat", emoji: "🐐" },
  { letter: "H", word: "Hat", emoji: "👒" },
  { letter: "I", word: "Igloo", emoji: "🧊" },
  { letter: "J", word: "Juice", emoji: "🧃" },
  { letter: "K", word: "Kite", emoji: "🪁" },
  { letter: "L", word: "Lion", emoji: "🦁" },
  { letter: "M", word: "Mouse", emoji: "🐭" },
  { letter: "N", word: "Nest", emoji: "🪹" },
  { letter: "O", word: "Octopus", emoji: "🐙" },
  { letter: "P", word: "Pig", emoji: "🐷" },
  { letter: "Q", word: "Queen", emoji: "👑" },
  { letter: "R", word: "Rainbow", emoji: "🌈" },
  { letter: "S", word: "Sun", emoji: "☀️" },
  { letter: "T", word: "Tiger", emoji: "🐯" },
  { letter: "U", word: "Umbrella", emoji: "☂️" },
  { letter: "V", word: "Violin", emoji: "🎻" },
  { letter: "W", word: "Whale", emoji: "🐳" },
  { letter: "X", word: "Xylophone", emoji: "xylophone" },
  { letter: "Y", word: "Yacht", emoji: "⛵" },
  { letter: "Z", word: "Zebra", emoji: "🦓" },
];
const numbersData = [
  { number: 1, emoji: "🍓" },
  { number: 2, emoji: "🍊" },
  { number: 3, emoji: "🍋" },
  { number: 4, emoji: "🍌" },
  { number: 5, emoji: "🍉" },
  { number: 6, emoji: "🍇" },
  { number: 7, emoji: "🥑" },
  { number: 8, emoji: "🥕" },
  { number: 9, emoji: "🥦" },
  { number: 10, emoji: "🌶️" },
];
const colorsData = [
  { name: "Red", hex: "#ef4444" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Brown", hex: "#78350f" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
];
const shapesData = [
  {
    name: "Circle",
    svg: <circle cx="50" cy="50" r="40" strokeWidth="3" fill="currentColor" />,
  },
  {
    name: "Square",
    svg: (
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        strokeWidth="3"
        fill="currentColor"
      />
    ),
  },
  {
    name: "Triangle",
    svg: (
      <polygon points="50,10 90,90 10,90" strokeWidth="3" fill="currentColor" />
    ),
  },
  {
    name: "Star",
    svg: (
      <polygon
        points="50,10 61,35 90,35 68,55 75,85 50,70 25,85 32,55 10,35 39,35"
        strokeWidth="3"
        fill="currentColor"
      />
    ),
  },
  {
    name: "Heart",
    svg: (
      <path
        d="M50 85 C-20 45, 20 0, 50 30 C80 0, 120 45, 50 85"
        strokeWidth="3"
        fill="currentColor"
      />
    ),
  },
  {
    name: "Rectangle",
    svg: (
      <rect
        x="10"
        y="25"
        width="80"
        height="50"
        strokeWidth="3"
        fill="currentColor"
      />
    ),
  },
];
const rhymesData = [
  {
    title: "Twinkle, Twinkle, Little Star",
    emoji: "🌟",
    lyrics:
      "Twinkle, twinkle, little star,\nHow I wonder what you are.\nUp above the world so high,\nLike a diamond in the sky.\nTwinkle, twinkle, little star,\nHow I wonder what you are.",
  },
  {
    title: "Baa, Baa, Black Sheep",
    emoji: "🐑",
    lyrics:
      "Baa, baa, black sheep,\nHave you any wool?\nYes sir, yes sir,\nThree bags full.\nOne for the master,\nAnd one for the dame,\nAnd one for the little boy\nWho lives down the lane.",
  },
];
const badges = {
  "memory-master": {
    name: "Memory Master",
    emoji: "🧠",
    message: "You're a Memory Master!",
  },
  "color-wizard": {
    name: "Color Wizard",
    emoji: "🎨",
    message: "Amazing! You are a Color Wizard!",
  },
};

// --- Helper function for Text-to-Speech ---
const speak = (text) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

// --- LEARNING ZONE & GAMES COMPONENTS ---

const HomePage = ({ setActivity }) => (
  <div className="text-center">
    <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 animate-bounce">
      Welcome Explorers!
    </h1>
    <p className="text-xl md:text-2xl text-gray-600 mb-12">
      Let's go on a learning adventure!
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <button
        onClick={() => setActivity("alphabet")}
        className="bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold py-10 px-6 rounded-3xl text-4xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      >
        🔤 Alphabet
      </button>
      <button
        onClick={() => setActivity("numbers")}
        className="bg-gradient-to-br from-rose-400 to-rose-600 text-white font-bold py-10 px-6 rounded-3xl text-4xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      >
        🔢 Numbers
      </button>
      <button
        onClick={() => setActivity("colors")}
        className="bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold py-10 px-6 rounded-3xl text-4xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      >
        🎨 Colors
      </button>
      <button
        onClick={() => setActivity("shapes")}
        className="bg-gradient-to-br from-lime-400 to-lime-600 text-white font-bold py-10 px-6 rounded-3xl text-4xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      >
        🔷 Shapes
      </button>
      <button
        onClick={() => setActivity("rhymes")}
        className="bg-gradient-to-br from-violet-400 to-violet-600 text-white font-bold py-10 px-6 rounded-3xl text-4xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      >
        🎶 Rhymes
      </button>
      <button
        onClick={() => setActivity("games")}
        className="bg-gradient-to-br from-teal-400 to-teal-600 text-white font-bold py-10 px-6 rounded-3xl text-4xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
      >
        🎮 Play Games
      </button>
    </div>
  </div>
);
const NoResults = () => (
  <div className="text-center py-10">
    <p className="text-5xl">😢</p>
    <p className="text-2xl font-semibold text-gray-600 mt-4">
      Oops! Nothing found.
    </p>
    <p className="text-lg text-gray-500">Try searching for something else.</p>
  </div>
);
const AlphabetPage = ({ searchTerm }) => {
  const filteredData = alphabetData.filter(
    (item) =>
      item.letter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8 text-sky-700">
        The Alphabet
      </h2>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredData.map((item) => (
            <div
              key={item.letter}
              onClick={() => speak(`${item.letter} is for ${item.word}`)}
              className="bg-white p-4 rounded-2xl shadow-lg cursor-pointer flex flex-col items-center justify-center aspect-square transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <span className="text-7xl font-bold text-sky-600">
                {item.letter}
              </span>
              <span className="text-4xl mt-2">{item.emoji}</span>
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};
const NumbersPage = ({ searchTerm }) => {
  const filteredData = numbersData.filter((item) =>
    String(item.number).includes(searchTerm)
  );
  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8 text-rose-700">
        Counting Numbers
      </h2>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredData.map((item) => (
            <div
              key={item.number}
              onClick={() => speak(item.number)}
              className="bg-white p-4 rounded-2xl shadow-lg cursor-pointer flex flex-col items-center justify-center aspect-square transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <span className="text-7xl font-bold text-rose-600">
                {item.number}
              </span>
              <div className="text-3xl mt-2 flex flex-wrap justify-center">
                {Array.from({ length: item.number }).map((_, i) => (
                  <span key={i}>{item.emoji}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};
const ColorsPage = ({ searchTerm }) => {
  const filteredData = colorsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8 text-amber-700">
        Colorful World
      </h2>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredData.map((color) => (
            <div
              key={color.name}
              onClick={() => speak(color.name)}
              style={{
                backgroundColor: color.hex,
                border: color.name === "White" ? "2px solid #ddd" : "none",
              }}
              className="rounded-2xl shadow-lg cursor-pointer flex items-center justify-center aspect-square transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <span
                className={`font-bold text-3xl p-2 bg-white/50 rounded-lg ${
                  color.name === "Black" ||
                  color.name === "Brown" ||
                  color.name === "Purple" ||
                  color.name === "Blue"
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                {color.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};
const ShapesPage = ({ searchTerm }) => {
  const filteredData = shapesData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8 text-lime-700">
        Fun Shapes
      </h2>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredData.map((shape) => (
            <div
              key={shape.name}
              onClick={() => speak(shape.name)}
              className="bg-white p-4 rounded-2xl shadow-lg cursor-pointer flex flex-col items-center justify-center aspect-square transform hover:scale-110 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <svg viewBox="0 0 100 100" className="w-28 h-28 text-lime-500">
                {shape.svg}
              </svg>
              <span className="font-bold text-2xl mt-2 text-gray-700">
                {shape.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};
const RhymesPage = ({ searchTerm }) => {
  const filteredData = rhymesData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h2 className="text-5xl font-bold text-center mb-8 text-violet-700">
        Rhymes & Songs
      </h2>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredData.map((rhyme) => (
            <div
              key={rhyme.title}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-3xl font-bold text-violet-800 mb-4">
                {rhyme.emoji} {rhyme.title}
              </h3>
              <p className="text-gray-600 text-lg whitespace-pre-line mb-5">
                {rhyme.lyrics}
              </p>
              <button
                onClick={() => speak(rhyme.lyrics)}
                className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Listen 🎧
              </button>
            </div>
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

const GamesHomePage = ({ setActivity, earnedBadges }) => (
  <div className="text-center">
    <h2 className="text-5xl font-bold text-center mb-8 text-teal-700">
      Game Zone
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        onClick={() => setActivity("memoryGame")}
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      >
        <h3 className="text-3xl font-bold text-rose-500 mb-2">
          🧠 Memory Match
        </h3>
        <p className="text-gray-600 mb-4">
          Match the pairs of cards. A fun test for your memory!
        </p>
        {earnedBadges.includes("memory-master") && (
          <div className="inline-block bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full">
            🏆 Badge Earned!
          </div>
        )}
      </div>
      <div
        onClick={() => setActivity("colorGame")}
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      >
        <h3 className="text-3xl font-bold text-sky-500 mb-2">
          🎨 Color Splash
        </h3>
        <p className="text-gray-600 mb-4">
          Guess the correct color of the object shown. Show your color skills!
        </p>
        {earnedBadges.includes("color-wizard") && (
          <div className="inline-block bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-full">
            🏆 Badge Earned!
          </div>
        )}
      </div>
    </div>
  </div>
);
const MemoryMatchGame = ({ onGameWin }) => {
  const gameItems = useMemo(
    () =>
      ["🍎", "⚽", "🐱", "🐶", "🐘", "🐠"]
        .flatMap((i) => [i, i])
        .sort(() => Math.random() - 0.5),
    []
  );
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const handleCardClick = (index) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return;
    setFlipped((prev) => [...prev, index]);
  };
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (gameItems[first] === gameItems[second]) {
        setMatched((prev) => [...prev, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, gameItems]);
  useEffect(() => {
    if (matched.length > 0 && matched.length === gameItems.length) {
      onGameWin("memory-master");
    }
  }, [matched, gameItems.length, onGameWin]);
  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-6 text-rose-700">
        Memory Match
      </h2>
      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
        {gameItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`aspect-square rounded-lg flex items-center justify-center text-5xl cursor-pointer transition-transform duration-500 ${
              flipped.includes(index) || matched.includes(index)
                ? "bg-rose-200 transform-gpu rotate-y-180"
                : "bg-rose-400"
            }`}
          >
            {flipped.includes(index) || matched.includes(index) ? item : "?"}
          </div>
        ))}
      </div>
    </div>
  );
};
const ColorSplashGame = ({ onGameWin }) => {
  const questions = useMemo(
    () =>
      [
        { item: "🍓", color: "Red", options: ["Red", "Blue", "Green"] },
        {
          item: "🍌",
          color: "Yellow",
          options: ["Orange", "Yellow", "Purple"],
        },
        { item: "🥦", color: "Green", options: ["Brown", "Pink", "Green"] },
      ].sort(() => Math.random() - 0.5),
    []
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState("");
  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].color) {
      setFeedback("Correct! 🎉");
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((q) => q + 1);
          setFeedback("");
        } else {
          onGameWin("color-wizard");
        }
      }, 1500);
    } else {
      setFeedback("Try again! 🤔");
      setTimeout(() => setFeedback(""), 1500);
    }
  };
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-6 text-sky-700">Color Splash</h2>
      <p className="text-2xl mb-4">What color is this?</p>
      <div className="text-8xl mb-6">{questions[currentQuestion].item}</div>
      <div className="flex justify-center gap-4">
        {questions[currentQuestion].options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-xl"
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="text-2xl font-bold mt-6">{feedback}</p>}
    </div>
  );
};

// --- LOGIN & Main App Components ---

const LoginPage = ({ setUserRole }) => {
  const [loginType, setLoginType] = useState("parent");
  const [authMethod, setAuthMethod] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setUserRole(loginType);
  };
  const handleOtpRequest = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-amber-200">
      <h1 className="text-4xl font-bold text-gray-700 mb-2">🎈 Learning Fun</h1>
      <p className="text-gray-500 mb-8">Welcome! Who are you?</p>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => setUserRole("student")}
          className="w-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold py-4 px-6 rounded-2xl text-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-8"
        >
          Let'S Play! 🎮
        </button>
        <div className="flex justify-center border-b-2 mb-6">
          <button
            onClick={() => setLoginType("parent")}
            className={`px-6 py-2 text-lg font-semibold transition ${
              loginType === "parent"
                ? "border-b-4 border-rose-500 text-rose-600"
                : "text-gray-500"
            }`}
          >
            Parent
          </button>
          <button
            onClick={() => setLoginType("teacher")}
            className={`px-6 py-2 text-lg font-semibold transition ${
              loginType === "teacher"
                ? "border-b-4 border-sky-500 text-sky-600"
                : "text-gray-500"
            }`}
          >
            Teacher
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          {loginType === "parent" ? "Parent Login" : "Teacher Login"}
        </h2>
        {authMethod === "email" && (
          <form onSubmit={handleLogin}>
            <input
              className="w-full p-3 mb-4 border-2 rounded-lg"
              type="email"
              placeholder="Email Address"
              required
            />
            <input
              className="w-full p-3 mb-4 border-2 rounded-lg"
              type="password"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold py-3 rounded-lg text-lg hover:shadow-lg transition"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("otp")}
              className="w-full mt-2 text-blue-600 hover:underline"
            >
              Use Phone
            </button>
          </form>
        )}
        {authMethod === "otp" && (
          <form onSubmit={handleLogin}>
            {!otpSent ? (
              <>
                <input
                  className="w-full p-3 mb-4 border-2 rounded-lg"
                  type="tel"
                  placeholder="Phone Number"
                  required
                />
                <button
                  type="button"
                  onClick={handleOtpRequest}
                  className="w-full bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold py-3 rounded-lg text-lg hover:shadow-lg transition"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <p className="text-center text-green-600 mb-2">OTP sent!</p>
                <input
                  className="w-full p-3 mb-4 border-2 rounded-lg"
                  type="text"
                  placeholder="Enter OTP"
                  required
                  maxLength="4"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold py-3 rounded-lg text-lg hover:shadow-lg transition"
                >
                  Login
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className="w-full mt-2 text-purple-600 hover:underline"
            >
              Use Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const LearningZone = ({
  userRole,
  setUserRole,
  earnedBadges,
  onGameWin,
  onChatbotToggle,
}) => {
  const [activity, setActivity] = useState("home");
  const [isListening, setIsListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleVoiceCommand = (command) => {
    const c = command.toLowerCase();
    if (c.includes("alphabet")) setActivity("alphabet");
    else if (c.includes("number")) setActivity("numbers");
    else if (c.includes("color")) setActivity("colors");
    else if (c.includes("shape")) setActivity("shapes");
    else if (c.includes("rhyme")) setActivity("rhymes");
    else if (c.includes("game")) setActivity("games");
    else if (c.includes("home")) setActivity("home");
  };
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      handleVoiceCommand(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    if (isListening) recognition.start();
    else recognition.stop();
    return () => recognition.stop();
  }, [isListening]);
  useEffect(() => {
    setSearchTerm("");
  }, [activity]);
  const handleGameWinAndRedirect = (badgeId) => {
    onGameWin(badgeId);
    setActivity("games");
  };
  const renderActivity = () => {
    switch (activity) {
      case "alphabet":
        return <AlphabetPage searchTerm={searchTerm} />;
      case "numbers":
        return <NumbersPage searchTerm={searchTerm} />;
      case "colors":
        return <ColorsPage searchTerm={searchTerm} />;
      case "shapes":
        return <ShapesPage searchTerm={searchTerm} />;
      case "rhymes":
        return <RhymesPage searchTerm={searchTerm} />;
      case "games":
        return (
          <GamesHomePage
            setActivity={setActivity}
            earnedBadges={earnedBadges}
          />
        );
      case "memoryGame":
        return <MemoryMatchGame onGameWin={handleGameWinAndRedirect} />;
      case "colorGame":
        return <ColorSplashGame onGameWin={handleGameWinAndRedirect} />;
      default:
        return <HomePage setActivity={setActivity} />;
    }
  };
  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <h1
            className="text-3xl font-bold text-gray-700 cursor-pointer"
            onClick={() => setActivity("home")}
          >
            🎈 Learning Fun
          </h1>
          {activity !== "home" && !activity.toLowerCase().includes("game") && (
            <div className="relative flex-grow max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-sky-400 transition"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActivity("home")}
              className="p-2 rounded-full hover:bg-gray-200 transition"
              title="Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
            <button
              onClick={() => console.log("Settings!")}
              className="p-2 rounded-full hover:bg-gray-200 transition"
              title="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setIsListening((p) => !p)}
              className={`p-2 rounded-full transition ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "hover:bg-gray-200"
              }`}
              title="Voice Command"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <button
              onClick={() => setUserRole(null)}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-full transition"
            >
              Login
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">{renderActivity()}</main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Made with ❤️ for happy learning!</p>
      </footer>
      <button
        onClick={onChatbotToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl transform hover:scale-110 transition-transform"
      >
        🤖
      </button>
    </>
  );
};

const BadgeModal = ({ badge, onClose }) => {
  if (!badge) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 text-center transform transition-all animate-bounce"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-8xl">{badge.emoji}</div>
        <h2 className="text-4xl font-bold text-yellow-500 mt-4">
          Badge Unlocked!
        </h2>
        <p className="text-2xl text-gray-700 mt-2">{badge.message}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full text-lg"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

const Chatbot = ({ isOpen, onClose, messages, onSendMessage }) => {
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !isOpen) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSendMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, isOpen, onSendMessage]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput("");
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-40">
      <header className="bg-purple-600 text-white p-3 flex justify-between items-center rounded-t-2xl">
        <h3 className="font-bold text-lg">🤖 AI Buddy</h3>
        <button onClick={onClose} className="text-2xl">
          &times;
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <div
              className={`py-2 px-4 rounded-2xl max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me something..."
            className="flex-1 border-2 rounded-full py-2 px-4 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={() => setIsListening((p) => !p)}
            className={`transition-colors rounded-full w-10 h-10 flex items-center justify-center text-xl ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            🎤
          </button>
          <button
            type="submit"
            className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
};

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your AI Buddy. Ask me about animals, colors, or letters!",
    },
  ]);

  const handleGameWin = (badgeId) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges((prev) => [...prev, badgeId]);
      setNewlyEarnedBadge(badges[badgeId]);
      speak(`Wow! You earned the ${badges[badgeId].name} badge!`);
    }
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("lion"))
      return "A lion is a big, brave cat that says 'ROAR!' 🦁";
    if (msg.includes("dog"))
      return "A dog is a friendly animal that wags its tail and says 'Woof! Woof!' 🐶";
    if (msg.includes("cat"))
      return "A cat is a cute animal that likes to nap and says 'Meow!' 🐱";
    if (msg.includes("apple"))
      return "An apple is a yummy red or green fruit that's crunchy to eat! 🍎";
    if (msg.includes("sun"))
      return "The sun is a big, bright star that keeps us warm and gives us light! ☀️";
    if (msg.includes("blue"))
      return "Blue is the color of the big sky and the deep ocean! 🌊";
    if (msg.includes("red"))
      return "Red is the color of yummy strawberries and fire trucks! 🍓🚒";
    if (msg.includes("hello") || msg.includes("hi"))
      return "Hello there, friend! What would you like to learn today?";
    return "That's a great question! I am still learning. Try asking me about a cat, a dog, or the color blue.";
  };

  const handleSendMessage = (userInput) => {
    const newUserMessage = { sender: "user", text: userInput };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    setTimeout(() => {
      const botResponse = getBotResponse(userInput);
      const newBotMessage = { sender: "bot", text: botResponse };
      setMessages((prev) => [...prev, newBotMessage]);
      speak(botResponse);
    }, 1000);
  };

  if (!userRole) {
    return <LoginPage setUserRole={setUserRole} />;
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-200 min-h-screen font-sans">
      <LearningZone
        userRole={userRole}
        setUserRole={setUserRole}
        earnedBadges={earnedBadges}
        onGameWin={handleGameWin}
        onChatbotToggle={() => setIsChatOpen((prev) => !prev)}
      />
      <BadgeModal
        badge={newlyEarnedBadge}
        onClose={() => setNewlyEarnedBadge(null)}
      />
      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
