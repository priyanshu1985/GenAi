import React from "react";
import LanguageSelector from "../components/LanguageSelector";

import LearningCard from "../components/LearningCard";


const ChildDashboard = () => {
  return (
    <div style={container}>
      <h1 style={title}>👶 Child Learning Zone</h1>
      <p style={subtitle}>Talk & Learn with your AI Friend</p>

      {/* Language */}
      <div style={box}>
        <h3>🌍 Select Language</h3>
        <select style={select}>
          <option>Hindi</option>
          <option>Marathi</option>
          <option>English</option>
        </select>
      </div>

      {/* Voice Button */}
      <div style={box}>
        <button style={voiceBtn}>🎙️ Press & Speak</button>
        <p style={{ marginTop: "10px" }}>
          Ask anything like: “A se Apple”
        </p>
      </div>

      {/* Learning Options */}
      <LanguageSelector onSelect={(lang) => console.log("Selected:", lang)} />

      <div style={grid}>
     <LearningCard title="Alphabets" emoji="🔤" bgColor="#FF6F61" />
     <LearningCard title="Numbers" emoji="🔢" bgColor="#4CAF50" />
     <LearningCard title="Rhymes" emoji="🎶" bgColor="#FFB703" />
     <LearningCard title="Stories" emoji="📖" bgColor="#6A5ACD" />
</div>

    </div>
  );
};

/* -------- Styles -------- */

const container = {
  padding: "2rem",
  textAlign: "center",
  backgroundColor: "#FFF8E7",
  minHeight: "100vh",
};

const title = {
  fontSize: "2.5rem",
};

const subtitle = {
  fontSize: "1.2rem",
  marginBottom: "1.5rem",
};

const box = {
  margin: "1.5rem auto",
};

const select = {
  padding: "0.6rem",
  fontSize: "1rem",
  borderRadius: "8px",
};

const voiceBtn = {
  fontSize: "1.3rem",
  padding: "1rem 2rem",
  backgroundColor: "#FF6F61",
  color: "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1rem",
  marginTop: "2rem",
};


const card = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "1.5rem",
  borderRadius: "15px",
  fontSize: "1.2rem",
};

export default ChildDashboard;
