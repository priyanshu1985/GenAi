import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={nav}>
      <h2 style={logo}>🧸 Anganwadi AI</h2>

      <div style={links}>
        <Link to="/" style={link}>Home</Link>
        <Link to="/child" style={link}>Child</Link>
        <Link to="/worker" style={link}>Worker</Link>
        <Link to="/admin" style={link}>Admin</Link>
      </div>
    </nav>
  );
};

/* -------- Styles -------- */

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  backgroundColor: "#4CAF50",
  color: "white",
};

const logo = {
  margin: 0,
};

const links = {
  display: "flex",
  gap: "1rem",
};

const link = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

export default Navbar;
