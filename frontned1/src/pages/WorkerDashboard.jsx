import React from "react";

const WorkerDashboard = () => {
  return (
    <div style={container}>
      <h1 style={title}>👩‍🏫 Anganwadi Worker Dashboard</h1>
      <p style={subtitle}>Monitor child progress & activities</p>

      {/* Child List */}
      <div style={section}>
        <h2>👶 Children Overview</h2>

        <div style={childCard}>
          <p><strong>Name:</strong> Raju</p>
          <p><strong>Age:</strong> 4</p>
          <p><strong>Level:</strong> Alphabets</p>
          <p><strong>Status:</strong> 🟢 Active</p>
        </div>

        <div style={childCard}>
          <p><strong>Name:</strong> Sita</p>
          <p><strong>Age:</strong> 5</p>
          <p><strong>Level:</strong> Numbers</p>
          <p><strong>Status:</strong> 🟡 Needs Attention</p>
        </div>
      </div>

      {/* AI Suggestions */}
      <div style={section}>
        <h2>🤖 AI Suggested Activities</h2>

        <ul style={list}>
          <li>📖 Storytelling session (Hindi)</li>
          <li>🔤 Alphabet revision for beginners</li>
          <li>🎶 Rhymes for attention improvement</li>
        </ul>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const container = {
  padding: "2rem",
  backgroundColor: "#F4F6F8",
  minHeight: "100vh",
};

const title = {
  textAlign: "center",
  fontSize: "2.3rem",
};

const subtitle = {
  textAlign: "center",
  marginBottom: "2rem",
};

const section = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "2rem",
};

const childCard = {
  border: "1px solid #ddd",
  padding: "1rem",
  borderRadius: "10px",
  marginBottom: "1rem",
};

const list = {
  lineHeight: "2rem",
  fontSize: "1.1rem",
};

export default WorkerDashboard;
