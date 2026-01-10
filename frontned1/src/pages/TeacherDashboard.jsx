import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/TeacherDashboard.css";

// ============================================================
// DEMO DATA - In production, fetch from Supabase
// ============================================================
const DEMO_CHILDREN = [
  {
    id: 1,
    name: "Raju Kumar",
    age: 4,
    parentName: "Sunita Kumar",
    parentPhone: "+91 98765 43210",
    level: "Alphabets",
    progress: 65,
    lastActive: "Today",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 5,
    parentName: "Rakesh Sharma",
    parentPhone: "+91 87654 32109",
    level: "Numbers",
    progress: 80,
    lastActive: "Yesterday",
    status: "active",
  },
  {
    id: 3,
    name: "Amit Singh",
    age: 3,
    parentName: "Meena Singh",
    parentPhone: "+91 76543 21098",
    level: "Colors",
    progress: 40,
    lastActive: "2 days ago",
    status: "inactive",
  },
  {
    id: 4,
    name: "Sita Devi",
    age: 6,
    parentName: "Ram Prasad",
    parentPhone: "+91 65432 10987",
    level: "Shapes",
    progress: 90,
    lastActive: "Today",
    status: "active",
  },
];

const DEMO_MESSAGES = [
  {
    id: 1,
    from: "Sunita Kumar",
    child: "Raju",
    message: "Raju is enjoying the alphabet lessons!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    from: "Rakesh Sharma",
    child: "Priya",
    message: "Can you suggest more number activities?",
    time: "Yesterday",
    read: true,
  },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [children] = useState(DEMO_CHILDREN);
  const [messages] = useState(DEMO_MESSAGES);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Stats calculation
  const totalChildren = children.length;
  const activeToday = children.filter((c) => c.lastActive === "Today").length;
  const avgProgress = Math.round(
    children.reduce((sum, c) => sum + c.progress, 0) / children.length
  );
  const unreadMessages = messages.filter((m) => !m.read).length;

  const handleViewChild = (child) => {
    setSelectedChild(child);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChild) {
      // In production, send to backend API
      alert(`Message sent to ${selectedChild.parentName}: ${newMessage}`);
      setNewMessage("");
      setShowMessageModal(false);
    }
  };

  const getStatusColor = (status) => {
    return status === "active" ? "#48BB78" : "#CBD5E0";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "#48BB78";
    if (progress >= 50) return "#ECC94B";
    return "#FC8181";
  };

  return (
    <div className="teacher-dashboard">
      <Navbar />

      <main className="teacher-main">
        {/* Header */}
        <header className="teacher-header">
          <div className="header-info">
            <h1>Welcome, {user?.name || "Teacher"}</h1>
            <p>Manage your students and track their progress</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/videos")}
            >
              Manage Videos
            </button>
            <button className="btn-secondary">+ Add Child</button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <span>👶</span>
            </div>
            <div className="stat-info">
              <h3>{totalChildren}</h3>
              <p>Total Children</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <span>🟢</span>
            </div>
            <div className="stat-info">
              <h3>{activeToday}</h3>
              <p>Active Today</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <span>📊</span>
            </div>
            <div className="stat-info">
              <h3>{avgProgress}%</h3>
              <p>Avg Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <span>💬</span>
            </div>
            <div className="stat-info">
              <h3>{unreadMessages}</h3>
              <p>New Messages</p>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Children List */}
          <section className="children-section">
            <div className="section-header">
              <h2>My Students</h2>
              <input
                type="search"
                placeholder="Search students..."
                className="search-input"
              />
            </div>

            <div className="children-list">
              {children.map((child) => (
                <div
                  key={child.id}
                  className={`child-card ${
                    selectedChild?.id === child.id ? "selected" : ""
                  }`}
                  onClick={() => handleViewChild(child)}
                >
                  <div className="child-avatar">
                    {child.name.charAt(0)}
                  </div>
                  <div className="child-info">
                    <h4>{child.name}</h4>
                    <p>Age: {child.age} | Level: {child.level}</p>
                  </div>
                  <div className="child-status">
                    <div
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(child.status) }}
                    />
                    <span className="last-active">{child.lastActive}</span>
                  </div>
                  <div className="child-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${child.progress}%`,
                          backgroundColor: getProgressColor(child.progress),
                        }}
                      />
                    </div>
                    <span>{child.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Child Detail / Messages */}
          <section className="detail-section">
            {selectedChild ? (
              <div className="child-detail">
                <div className="detail-header">
                  <div className="detail-avatar">
                    {selectedChild.name.charAt(0)}
                  </div>
                  <div>
                    <h2>{selectedChild.name}</h2>
                    <p>Age: {selectedChild.age} years</p>
                  </div>
                </div>

                <div className="detail-stats">
                  <div className="detail-stat">
                    <span className="label">Current Level</span>
                    <span className="value">{selectedChild.level}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="label">Progress</span>
                    <span className="value">{selectedChild.progress}%</span>
                  </div>
                  <div className="detail-stat">
                    <span className="label">Last Active</span>
                    <span className="value">{selectedChild.lastActive}</span>
                  </div>
                </div>

                <div className="parent-info">
                  <h3>Parent Information</h3>
                  <p><strong>Name:</strong> {selectedChild.parentName}</p>
                  <p><strong>Phone:</strong> {selectedChild.parentPhone}</p>
                </div>

                <div className="detail-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setShowMessageModal(true)}
                  >
                    Message Parent
                  </button>
                  <button className="btn-secondary">View Full Report</button>
                </div>

                {/* Learning Progress */}
                <div className="learning-progress">
                  <h3>Learning Progress</h3>
                  <div className="progress-items">
                    <div className="progress-item">
                      <span>Alphabets</span>
                      <div className="mini-progress">
                        <div style={{ width: "75%", backgroundColor: "#48BB78" }} />
                      </div>
                      <span>75%</span>
                    </div>
                    <div className="progress-item">
                      <span>Numbers</span>
                      <div className="mini-progress">
                        <div style={{ width: "60%", backgroundColor: "#ECC94B" }} />
                      </div>
                      <span>60%</span>
                    </div>
                    <div className="progress-item">
                      <span>Colors</span>
                      <div className="mini-progress">
                        <div style={{ width: "90%", backgroundColor: "#48BB78" }} />
                      </div>
                      <span>90%</span>
                    </div>
                    <div className="progress-item">
                      <span>Shapes</span>
                      <div className="mini-progress">
                        <div style={{ width: "40%", backgroundColor: "#FC8181" }} />
                      </div>
                      <span>40%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <span>👈</span>
                <p>Select a student to view details</p>
              </div>
            )}
          </section>
        </div>

        {/* Recent Messages */}
        <section className="messages-section">
          <div className="section-header">
            <h2>Recent Messages from Parents</h2>
            <button className="btn-text">View All</button>
          </div>
          <div className="messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-card ${!msg.read ? "unread" : ""}`}
              >
                <div className="message-avatar">{msg.from.charAt(0)}</div>
                <div className="message-content">
                  <div className="message-header">
                    <strong>{msg.from}</strong>
                    <span className="message-child">({msg.child}'s parent)</span>
                  </div>
                  <p>{msg.message}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
                <button className="btn-reply">Reply</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Message Modal */}
      {showMessageModal && selectedChild && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Message to {selectedChild.parentName}</h3>
            <p className="modal-subtitle">
              Regarding: {selectedChild.name}'s learning progress
            </p>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
            />
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowMessageModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
