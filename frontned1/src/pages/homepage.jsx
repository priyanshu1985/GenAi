import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🧸 Anganwadi Learning Assistant</h1>
      <p>Voice-first, multilingual learning for children</p>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/child" style={linkStyle}>👶 Child Dashboard</Link>
        <br />
        <Link to="/worker" style={linkStyle}>👩‍🏫 Worker Dashboard</Link>
        <br />
        <Link to="/admin" style={linkStyle}>🖥️ Admin Dashboard</Link>
      </div>
    </div>
  );
};

const linkStyle = {
  display: "inline-block",
  margin: "1rem",
  padding: "0.8rem 2rem",
  backgroundColor: "#4CAF50",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
};

export default HomePage;
