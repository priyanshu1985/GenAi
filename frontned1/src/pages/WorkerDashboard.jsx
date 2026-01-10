import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const WorkerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div style={container}>
      {/* Header with Language Switcher */}
      <div style={header}>
        <div>
          <h1 style={title}>👩‍🏫 {t("worker.title")}</h1>
          <p style={subtitle}>{t("worker.learningProgress")}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Stats Overview */}
      <div style={statsContainer}>
        <div style={statCard}>
          <h3>{t("worker.totalChildren")}</h3>
          <p style={statNumber}>15</p>
        </div>
        <div style={statCard}>
          <h3>{t("worker.activeToday")}</h3>
          <p style={statNumber}>12</p>
        </div>
      </div>

      {/* Child List */}
      <div style={section}>
        <h2>👶 {t("worker.children")}</h2>

        <div style={childCard}>
          <p>
            <strong>{t("auth.email")}:</strong> Raju
          </p>
          <p>
            <strong>Age:</strong> 4
          </p>
          <p>
            <strong>Level:</strong> {t("learning.alphabets")}
          </p>
          <p>
            <strong>Status:</strong> 🟢 {t("learning.inProgress")}
          </p>
        </div>

        <div style={childCard}>
          <p>
            <strong>{t("auth.email")}:</strong> Sita
          </p>
          <p>
            <strong>Age:</strong> 5
          </p>
          <p>
            <strong>Level:</strong> {t("learning.numbers")}
          </p>
          <p>
            <strong>Status:</strong> 🟡 {t("common.error")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={section}>
        <h2>⚡ {t("dashboard.quickActions")}</h2>
        <div style={buttonContainer}>
          <button style={actionButton}>{t("worker.addChild")}</button>
          <button style={actionButton}>{t("worker.viewChildren")}</button>
          <button style={actionButton}>{t("worker.manageActivities")}</button>
        </div>
      </div>

      {/* AI Suggestions */}
      <div style={section}>
        <h2>🤖 AI Suggested Activities</h2>

        <ul style={list}>
          <li>📖 Storytelling session ({t("language.hindi")})</li>
          <li>🔤 {t("learning.alphabets")} revision for beginners</li>
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

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "2rem",
  flexWrap: "wrap",
  gap: "1rem",
};

const title = {
  fontSize: "2rem",
  color: "#2D3748",
  margin: "0 0 0.5rem 0",
  fontWeight: "bold",
};

const subtitle = {
  color: "#718096",
  margin: 0,
  fontSize: "1.1rem",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginBottom: "2rem",
};

const statCard = {
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const statNumber = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#3182CE",
  margin: "0.5rem 0 0 0",
};

const section = {
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  marginBottom: "1.5rem",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const buttonContainer = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
};

const actionButton = {
  backgroundColor: "#3182CE",
  color: "white",
  border: "none",
  padding: "0.75rem 1.5rem",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "500",
  transition: "background-color 0.2s",
};

const childCard = {
  backgroundColor: "#F7FAFC",
  padding: "1rem",
  borderRadius: "6px",
  marginBottom: "1rem",
  border: "1px solid #E2E8F0",
};

const list = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

export default WorkerDashboard;
