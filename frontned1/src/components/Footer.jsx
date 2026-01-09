import React from "react";

const Footer = () => {
  return (
    <footer style={footer}>
      <p>© 2026 Anganwadi AI Learning Assistant</p>
      <p>Voice-first • Multilingual • Offline-first</p>
    </footer>
  );
};

/* -------- Styles -------- */

const footer = {
  textAlign: "center",
  padding: "1rem",
  backgroundColor: "#F1F1F1",
  marginTop: "2rem",
  fontSize: "0.9rem",
};

export default Footer;
