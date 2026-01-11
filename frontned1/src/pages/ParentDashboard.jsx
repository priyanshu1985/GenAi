import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ParentDashboard.css";

// ============================================================
// API Configuration
// ============================================================
const API_BASE_URL = "http://localhost:8000/api"; // Updated to buildathon backend

// Message type emojis (database-tested working types)
const MESSAGE_TYPE_EMOJIS = {
  general: "💬",
  homework: "📚",
  announcement: "📢",
};

// Parent message types for sending (database-tested working types)
const PARENT_MESSAGE_TYPES = [
  { value: "general", label: "General Message", emoji: "💬" },
  { value: "doubt", label: "Doubt/Question", emoji: "❓" },
  { value: "complaint", label: "Complaint", emoji: "⚠️" },
  { value: "feedback", label: "Feedback", emoji: "💭" },
];

const ParentDashboard = () => {
  const { user } = useAuth();

  // Child and progress state
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  // Messaging state
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState("general");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data on component mount
  useEffect(() => {
    fetchChildren();
    fetchTeachers();
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug teachers loading
  useEffect(() => {
    console.log("Teachers updated:", teachers);
    console.log("Teachers count:", teachers.length);
  }, [teachers]);

  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/children/`);
      const data = await response.json();

      if (data.success && data.children.length > 0) {
        setChildren(data.children);
        // Auto-select first child
        setSelectedChild(data.children[0]);

        // Fetch detailed data for the selected child
        fetchChildDetails(data.children[0].child_id);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const fetchChildDetails = async (childId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/children/${childId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedChild(data.child);
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      console.log("Fetching teachers..."); // Debug log
      const response = await fetch(`${API_BASE_URL}/users/by-role/teacher`, {
        headers: {
          "X-User-Id": user?.id || "demo-parent-id",
          "X-User-Role": "parent",
        },
      });

      console.log("Teachers response:", response); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Teachers data:", data); // Debug log
        // Convert users array to teachers format
        const teachers = (data.users || []).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          subject: "General",
          grade: "All Grades",
        }));
        setTeachers(teachers);
      } else {
        console.error("Failed to fetch teachers:", response.status);
        // Fallback demo teachers for testing
        setTeachers([
          {
            id: "teacher-1",
            name: "Ms. Sarah Johnson",
            email: "sarah@school.com",
          },
          {
            id: "teacher-2",
            name: "Mr. David Smith",
            email: "david@school.com",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      // Fallback demo teachers for testing
      setTeachers([
        {
          id: "teacher-1",
          name: "Ms. Sarah Johnson",
          email: "sarah@school.com",
        },
        { id: "teacher-2", name: "Mr. David Smith", email: "david@school.com" },
        {
          id: "teacher-3",
          name: "Mrs. Emily Wilson",
          email: "emily@school.com",
        },
        {
          id: "teacher-4",
          name: "Mr. Michael Brown",
          email: "michael@school.com",
        },
      ]);
    }
  };

  const fetchMessages = async () => {
    try {
      console.log("Fetching messages for parent..."); // Debug log
      const response = await fetch(`${API_BASE_URL}/messages/received`, {
        headers: {
          "X-User-Id": user?.id || "demo-parent-id",
          "X-User-Role": "parent",
        },
      });

      console.log("Messages response:", response); // Debug log
      if (response.ok) {
        const data = await response.json();
        console.log("Messages data:", data); // Debug log

        // Backend already filters messages correctly by receiver_id
        // All messages here are from teachers to this parent
        setReceivedMessages(data.messages || []);
        console.log(
          "Messages from teachers loaded:",
          (data.messages || []).length
        ); // Debug log
      } else {
        console.error("Failed to fetch messages:", response.status);
        // Fallback demo messages
        setReceivedMessages([
          {
            id: "msg-1",
            sender_name: "Ms. Sarah Johnson",
            message: "Priyanshu completed his math homework excellently today!",
            message_type: "homework",
            timestamp: new Date().toISOString(),
            is_read: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Fallback demo messages
      setReceivedMessages([
        {
          id: "msg-1",
          sender_name: "Ms. Sarah Johnson",
          message: "Priyanshu completed his math homework excellently today!",
          message_type: "homework",
          timestamp: new Date().toISOString(),
          is_read: false,
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    console.log("Sending message:", {
      newMessage,
      selectedTeacher,
      messageType,
    }); // Debug log

    if (!newMessage.trim() || !selectedTeacher) {
      alert("Please fill in all required fields");
      return;
    }

    setSending(true);
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user?.id || "demo-parent-id",
          "X-User-Role": "parent",
        },
        body: JSON.stringify({
          receiver_id: selectedTeacher.id,
          message: newMessage.trim(),
          message_type: messageType,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Message sent successfully!");
        setNewMessage("");
        setShowMessageModal(false);
        fetchMessages();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.detail || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message: " + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    setLoading(true);
    fetchChildDetails(child.child_id);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your child's progress...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {user?.name || "Parent"}!
            </h1>
            <p className="welcome-subtitle">
              🌟 Track your child's amazing learning journey and stay connected
              with their teachers
            </p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-value">{children.length}</div>
              <div className="stat-label">👶 Children</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{receivedMessages.length}</div>
              <div className="stat-label">💌 Messages</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {selectedChild?.sessions_completed || 0}
              </div>
              <div className="stat-label">🎯 Sessions</div>
            </div>
          </div>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="child-selector">
            <h3>Select Child:</h3>
            <div className="child-cards">
              {children.map((child) => (
                <div
                  key={child.child_id}
                  className={`child-card ${
                    selectedChild?.child_id === child.child_id ? "selected" : ""
                  }`}
                  onClick={() => handleChildSelect(child)}
                >
                  <div className="child-avatar">{child.avatar}</div>
                  <div className="child-info">
                    <h4>{child.name}</h4>
                    <p>
                      Age: {child.age} • Level {child.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`tab-button ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            📈 Progress
          </button>
          <button
            className={`tab-button ${
              activeTab === "activities" ? "active" : ""
            }`}
            onClick={() => setActiveTab("activities")}
          >
            🎮 Activities
          </button>
          <button
            className={`tab-button ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            💬 Messages
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && selectedChild && (
          <div className="tab-content overview-tab">
            <div className="overview-content">
              {/* Child Profile Card */}
              <div className="overview-card">
                <h3>👶 Child Profile</h3>
                <div className="child-avatar-large">
                  {selectedChild.avatar || "👶"}
                </div>
                <h2>{selectedChild.name}</h2>
                <div className="profile-stats">
                  <span className="stat-item">
                    🎂 {selectedChild.age} years old
                  </span>
                  <span className="stat-item">
                    ⭐ Level {selectedChild.learning_level}
                  </span>
                  <span className="stat-item">
                    🔥 {selectedChild.sessions_completed} sessions
                  </span>
                </div>
              </div>

              <div className="overview-card">
                <h3>🌍 Learning Details</h3>
                <div className="detail-row">
                  <span>Language:</span>
                  <span>{selectedChild.preferred_language}</span>
                </div>
                <div className="detail-row">
                  <span>Level:</span>
                  <span>{selectedChild.learning_level}</span>
                </div>
                <div className="detail-row">
                  <span>Sessions:</span>
                  <span>{selectedChild.sessions_completed}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>🏆 Achievements</h3>
                <p>
                  Total achievements earned:{" "}
                  {selectedChild.achievements?.filter((a) => a.earned).length ||
                    0}
                </p>
                <p>Keep up the great work!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "progress" && selectedChild && (
          <div className="tab-content progress-tab">
            <div className="progress-content">
              <h3>Learning Progress</h3>

              {/* Progress Overview */}
              <div className="progress-overview">
                {Object.entries(selectedChild.progress || {}).map(
                  ([topic, percentage]) => (
                    <div key={topic} className="progress-card">
                      <h4>{topic.replace("_", " ").toUpperCase()}</h4>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>
                      <p className="progress-text">{percentage}%</p>
                    </div>
                  )
                )}
              </div>

              {/* Strengths and Areas to Improve */}
              <div className="skills-analysis">
                <div className="progress-card">
                  <h4>💪 Strong Areas</h4>
                  <div className="skill-tags">
                    {selectedChild.strong_areas?.map((skill, index) => (
                      <span key={index} className="skill-tag strong">
                        {skill.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="progress-card">
                  <h4>🎯 Areas to Focus</h4>
                  <div className="skill-tags">
                    {selectedChild.weak_areas?.map((skill, index) => (
                      <span key={index} className="skill-tag weak">
                        {skill.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activities" && selectedChild && (
          <div className="tab-content activities-tab">
            <div className="activities-content">
              <h3>Recent Activities</h3>

              <div className="activities-list">
                {selectedChild.recent_activities?.length > 0 ? (
                  selectedChild.recent_activities.map((activity) => (
                    <div key={activity.id} className="activity-card">
                      <div className="activity-icon">{activity.emoji}</div>
                      <div className="activity-info">
                        <h4>{activity.activity}</h4>
                        <p className="activity-category">{activity.category}</p>
                        <p className="activity-time">{activity.time}</p>
                      </div>
                      <div className="activity-score">{activity.score}</div>
                    </div>
                  ))
                ) : (
                  <div className="activity-card">
                    <p>🎮 No recent activities</p>
                    <p>
                      Activities will appear here once your child starts
                      learning!
                    </p>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="achievements-section">
                <h3>🏆 Achievements</h3>
                <div className="activities-content">
                  {selectedChild.achievements?.length > 0 ? (
                    selectedChild.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`activity-card ${
                          achievement.earned ? "earned" : "locked"
                        }`}
                      >
                        <div className="activity-icon">{achievement.emoji}</div>
                        <p className="activity-info">{achievement.title}</p>
                      </div>
                    ))
                  ) : (
                    <div className="activity-card">
                      <p>🏆 No achievements yet</p>
                      <p>Keep learning to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="tab-content messages-tab">
            <div className="messages-content">
              <div className="compose-message">
                <h3>💬 Messages</h3>
                <button
                  className="send-button"
                  onClick={() => {
                    console.log("Opening message modal, teachers:", teachers); // Debug log
                    setShowMessageModal(true);
                  }}
                >
                  ✉️ Send Message
                </button>
              </div>

              <div className="message-list">
                <h4>📨 From Teacher</h4>
                {receivedMessages.length > 0 ? (
                  receivedMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-item ${
                        !message.is_read ? "unread" : ""
                      }`}
                    >
                      <div className="message-header">
                        <div className="message-from">
                          <span className="sender-name">
                            👨‍🏫 {message.sender_name || "Teacher"}
                          </span>
                          {!message.is_read && (
                            <span className="new-badge">NEW</span>
                          )}
                        </div>
                        <div className="message-meta">
                          <span className="message-type">
                            {MESSAGE_TYPE_EMOJIS[message.message_type] || "💬"}{" "}
                            {message.message_type}
                          </span>
                          <span className="message-date">
                            {new Date(
                              message.timestamp || message.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="message-body">{message.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="message-item empty-state">
                    <p>📭 No messages from teacher yet</p>
                    <p>
                      Your child's teacher will send updates about homework,
                      progress, and announcements here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="success-banner">
            <p>✅ {successMessage}</p>
            <button onClick={() => setSuccessMessage("")}>×</button>
          </div>
        )}
      </main>

      {/* Send Message Modal */}
      {showMessageModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowMessageModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📨 Send Message to Teacher</h3>
              <button
                className="modal-close"
                onClick={() => setShowMessageModal(false)}
              >
                ×
              </button>
            </div>

            <div className="message-form">
              <div className="form-group">
                <label>Select Teacher:</label>
                <select
                  value={selectedTeacher?.id || ""}
                  onChange={(e) => {
                    console.log("Teacher selected:", e.target.value); // Debug log
                    setSelectedTeacher(
                      teachers.find((t) => t.id === e.target.value)
                    );
                  }}
                >
                  <option value="">Choose a teacher...</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {teachers.length === 0 && (
                  <small style={{ color: "#64748b" }}>
                    Loading teachers...
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Message Type:</label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                >
                  {PARENT_MESSAGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim() || !selectedTeacher}
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ParentDashboard;
