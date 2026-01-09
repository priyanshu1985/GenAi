import React from "react";

const AdminDashboard = () => {
  return (
    <div style={container}>
      <h1 style={title}>🖥️ Admin Dashboard</h1>
      <p style={subtitle}>Program Monitoring & Analytics</p>

      {/* Stats Section */}
      <div style={statsGrid}>
        <div style={statCard}>
          <h2>🏫 Anganwadi Centers</h2>
          <p style={statValue}>120</p>
        </div>

        <div style={statCard}>
          <h2>👶 Total Children</h2>
          <p style={statValue}>1,850</p>
        </div>

        <div style={statCard}>
          <h2>👩‍🏫 Workers</h2>
          <p style={statValue}>240</p>
        </div>

        <div style={statCard}>
          <h2>📊 Avg Progress</h2>
          <p style={statValue}>78%</p>
        </div>
      </div>

      {/* Insights Section */}
      <div style={section}>
        <h2>📈 Key Insights</h2>
        <ul style={list}>
          <li>Most children engage better with rhymes</li>
          <li>Hindi is the most used language</li>
          <li>Story-based learning improves retention</li>
        </ul>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const container = {
  padding: "2rem",
  backgroundColor: "#EEF2F7",
  minHeight: "100vh",
};

const title = {
  textAlign: "center",
  fontSize: "2.4rem",
};

const subtitle = {
  textAlign: "center",
  marginBottom: "2rem",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
};

const statCard = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  textAlign: "center",
};

const statValue = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
};

const section = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
};

const list = {
  lineHeight: "2rem",
  fontSize: "1.1rem",
};

export default AdminDashboard;
