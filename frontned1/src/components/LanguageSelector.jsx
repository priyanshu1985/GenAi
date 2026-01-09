import React from "react";

const LanguageSelector = ({ onSelect }) => {
  return (
    <div style={container}>
      <h3 style={title}>🌍 Choose Language</h3>

      <div style={buttons}>
        <button style={btn} onClick={() => onSelect("hi-IN")}>
          🇮🇳 Hindi
        </button>

        <button style={btn} onClick={() => onSelect("mr-IN")}>
          🇮🇳 Marathi
        </button>

        <button style={btn} onClick={() => onSelect("en-IN")}>
          🇬🇧 English
        </button>
      </div>
    </div>
  );
};

/* -------- Styles (Kid Friendly) -------- */

const container = {
  marginTop: "1.5rem",
};

const title = {
  fontSize: "1.3rem",
  marginBottom: "0.8rem",
};

const buttons = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
};

const btn = {
  fontSize: "1.1rem",
  padding: "0.6rem 1.2rem",
  borderRadius: "15px",
  border: "none",
  backgroundColor: "#FFD166",
  cursor: "pointer",
};

export default LanguageSelector;
