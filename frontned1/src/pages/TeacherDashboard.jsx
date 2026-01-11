import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/TeacherDashboard.css";

// ============================================================
// API Configuration
// ============================================================
const API_BASE_URL = "http://localhost:8000/api"; // Updated to buildathon backend

// Message types for the dropdown (Teacher -> Parent)
const MESSAGE_TYPES = [
  { value: "general", label: "General Message", emoji: "💬" },
  { value: "homework", label: "Homework", emoji: "📝" },
  { value: "progress", label: "Progress Update", emoji: "📊" },
  { value: "reminder", label: "Reminder", emoji: "🔔" },
  { value: "announcement", label: "Announcement", emoji: "📢" },
];

// Parent message types (for display)
const PARENT_MESSAGE_TYPES = {
  complaint: { label: "Complaint", emoji: "⚠️" },
  doubt: { label: "Doubt/Question", emoji: "❓" },
  feedback: { label: "Feedback", emoji: "💭" },
  general: { label: "General", emoji: "💬" },
};

const TeacherDashboard = () => {
  const { user } = useAuth();

  // State management
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState("general");
  const [sending, setSending] = useState(false);
  const [sentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data on mount
  useEffect(() => {
    fetchParents();
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch list of parents from API
  const fetchParents = async () => {
    try {
      console.log("Fetching parents for teacher..."); // Debug log
      const response = await fetch(`${API_BASE_URL}/users/by-role/parent`, {
        headers: {
          "X-User-Id": user?.id || "demo-teacher-id",
          "X-User-Role": "teacher",
        },
      });

      console.log("Parents response:", response); // Debug log
      if (response.ok) {
        const data = await response.json();
        console.log("Parents data:", data); // Debug log
        // Convert users array to parents format
        const parents = (data.users || []).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          child_name: "Student",
          phone: "+91-9876543210",
        }));
        setParents(parents);
      } else {
        console.error("Failed to fetch parents:", response.status);
        // Fallback demo parents
        setParents([
          {
            id: "parent-1",
            name: "Rajesh Sharma",
            email: "rajesh@gmail.com",
            child_name: "Priyanshu Manke",
          },
          {
            id: "parent-2",
            name: "Priya Patel",
            email: "priya@gmail.com",
            child_name: "Aadhya Patel",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching parents:", error);
      // Fallback demo parents
      setParents([
        {
          id: "parent-1",
          name: "Rajesh Sharma",
          email: "rajesh@gmail.com",
          child_name: "Priyanshu Manke",
        },
        {
          id: "parent-2",
          name: "Priya Patel",
          email: "priya@gmail.com",
          child_name: "Aadhya Patel",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages (sent and received)
  const fetchMessages = async () => {
    try {
      console.log("Fetching messages for teacher..."); // Debug log
      const response = await fetch(`${API_BASE_URL}/messages/received`, {
        headers: {
          "X-User-Id": user?.id || "demo-teacher-id",
          "X-User-Role": "teacher",
        },
      });

      console.log("Messages response:", response); // Debug log
      if (response.ok) {
        const data = await response.json();
        console.log("Messages data:", data); // Debug log

        // Backend already filters messages correctly by receiver_id
        // All messages here are from parents to this teacher
        setReceivedMessages(data.messages || []);
        console.log(
          "Messages from parents loaded:",
          (data.messages || []).length
        ); // Debug log
      } else {
        console.error("Failed to fetch messages:", response.status);
        // Fallback demo messages
        setReceivedMessages([
          {
            id: "msg-1",
            sender_name: "Rajesh Sharma",
            message: "I have a question about Priyanshu's homework progress.",
            message_type: "doubt",
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
          sender_name: "Rajesh Sharma",
          message: "I have a question about Priyanshu's homework progress.",
          message_type: "doubt",
          timestamp: new Date().toISOString(),
          is_read: false,
        },
      ]);
    }
  };

  // Send message to parent via API
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedParent) {
      setSuccessMessage("Please select a parent and enter a message.");
      return;
    }

    setSending(true);
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user?.id || "demo-teacher-id",
          "X-User-Role": "teacher",
        },
        body: JSON.stringify({
          receiver_id: selectedParent.id,
          message: newMessage.trim(),
          message_type: messageType,
        }),
      });

      if (response.ok) {
        setSuccessMessage(
          `Message sent successfully to ${selectedParent.name}!`
        );
        setNewMessage("");
        setSelectedParent(null);
        setShowMessageModal(false);
        fetchMessages();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSuccessMessage("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Mark message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: "POST",
        headers: {
          "X-User-Id": user?.id || "demo-teacher-id",
          "X-User-Role": "teacher",
        },
      });
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const getMessageTypeEmoji = (type) => {
    return PARENT_MESSAGE_TYPES[type]?.emoji || "💬";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading teacher dashboard...</p>
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
              Hello, {user?.name || "Teacher"}! 👨‍🏫
            </h1>
            <p className="welcome-subtitle">
              🚀 Empower young minds and build strong parent partnerships today
            </p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-value">{parents.length}</div>
              <div className="stat-label">👨‍👩‍👧‍👦 Parents</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{receivedMessages.length}</div>
              <div className="stat-label">📨 Received</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{sentMessages.length}</div>
              <div className="stat-label">📤 Sent</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`tab-button ${activeTab === "parents" ? "active" : ""}`}
            onClick={() => setActiveTab("parents")}
          >
            👨‍👩‍👧‍👦 Parents
          </button>
          <button
            className={`tab-button ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            💬 Messages
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-content">
              <div className="overview-card">
                <h3>👥 Parent Communication</h3>
                <p>
                  Maintain regular communication with {parents.length} parents
                </p>
                <p>
                  Keep parents informed about their child's progress and
                  activities
                </p>
              </div>

              <div className="overview-card">
                <h3>📊 Message Statistics</h3>
                <p>Received: {receivedMessages.length} messages</p>
                <p>Stay responsive to parent inquiries and feedback</p>
              </div>

              <div className="overview-card">
                <h3>🎯 Today's Focus</h3>
                <p>Review parent feedback</p>
                <p>Send progress updates</p>
                <p>Schedule parent meetings</p>
              </div>
            </div>
          )}

          {activeTab === "parents" && (
            <div className="parents-content">
              {parents.length > 0 ? (
                parents.map((parent) => (
                  <div key={parent.id} className="parent-card">
                    <h4 className="parent-name">{parent.name}</h4>
                    <p className="parent-contact">📧 {parent.email}</p>
                    <p className="parent-contact">
                      📱 {parent.phone || "Not provided"}
                    </p>
                    <button
                      className="contact-button"
                      onClick={() => {
                        setSelectedParent(parent);
                        setShowMessageModal(true);
                      }}
                    >
                      Send Message
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>📭 No parents found</p>
                  <p>Parents will appear here once they register</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="messages-content">
              <div className="compose-message">
                <h3>📨 Received Messages</h3>
                <button
                  className="send-button"
                  onClick={() => setShowMessageModal(true)}
                >
                  ✉️ Send Message
                </button>
              </div>

              <div className="message-list">
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
                            👨‍👩‍👧‍👦 {message.sender_name || "Parent"}
                          </span>
                          {!message.is_read && (
                            <span className="new-badge">NEW</span>
                          )}
                        </div>
                        <div className="message-meta">
                          <span className="message-type">
                            {getMessageTypeEmoji(message.message_type)}{" "}
                            {PARENT_MESSAGE_TYPES[message.message_type]
                              ?.label || "General"}
                          </span>
                          <span className="message-date">
                            {formatTime(
                              message.created_at || message.timestamp
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="message-body">{message.message}</div>
                      {!message.is_read && (
                        <button
                          className="mark-read-btn"
                          onClick={() => handleMarkAsRead(message.id)}
                        >
                          Mark as Read ✓
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="message-item empty-state">
                    <p>📭 No messages from parents yet</p>
                    <p>Messages from parents will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
              <h3 className="modal-title">📨 Send Message to Parent</h3>
              <button
                className="modal-close"
                onClick={() => setShowMessageModal(false)}
              >
                ×
              </button>
            </div>

            <div className="message-form">
              <div className="form-group">
                <label>Select Parent:</label>
                <select
                  value={selectedParent?.id || ""}
                  onChange={(e) =>
                    setSelectedParent(
                      parents.find((p) => p.id === e.target.value)
                    )
                  }
                >
                  <option value="">Choose a parent...</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Message Type:</label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                >
                  {MESSAGE_TYPES.map((type) => (
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
                  disabled={sending || !newMessage.trim() || !selectedParent}
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

export default TeacherDashboard;
