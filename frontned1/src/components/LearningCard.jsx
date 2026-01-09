import React from "react";

const LearningCard = ({ title, emoji, bgColor }) => {
  return (
    <div style={{ ...card, backgroundColor: bgColor }}>
      <span style={emojiStyle}>{emoji}</span>
      <h3 style={titleStyle}>{title}</h3>
    </div>
  );
};

/* -------- Styles (Kid Friendly) -------- */

const card = {
  height: "150px",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  fontSize: "1.4rem",
  cursor: "pointer",
  boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
};

const emojiStyle = {
  fontSize: "3rem",
};

const titleStyle = {
  marginTop: "10px",
};

export default LearningCard;
