import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ParentDashboard.css";

// ============================================================
// DEMO DATA - In production, fetch from Supabase
// ============================================================
const DEMO_CHILD = {
  id: 1,
  name: "Raju",
  age: 4,
  avatar: "R",
  level: 3,
  xp: 450,
  streak: 5,
  lastActive: "Today, 3:30 PM",
  totalTimeToday: "45 mins",
  totalTimeWeek: "4.5 hours",
};

const DEMO_PROGRESS = {
  alphabets: { completed: 18, total: 26, percent: 69 },
  numbers: { completed: 7, total: 10, percent: 70 },
  colors: { completed: 10, total: 12, percent: 83 },
  shapes: { completed: 4, total: 8, percent: 50 },
  rhymes: { completed: 5, total: 15, percent: 33 },
};

const DEMO_RECENT_ACTIVITIES = [
  {
    id: 1,
    activity: "Completed Alphabet A-E",
    category: "Alphabets",
    time: "Today, 3:30 PM",
    score: "5/5",
    emoji: "🔤",
  },
  {
    id: 2,
    activity: "Learned Colors - Red, Blue, Green",
    category: "Colors",
    time: "Today, 2:15 PM",
    score: "3/3",
    emoji: "🎨",
  },
  {
    id: 3,
    activity: "Counting 1-5",
    category: "Numbers",
    time: "Yesterday",
    score: "4/5",
    emoji: "🔢",
  },
  {
    id: 4,
    activity: "Watched Shapes Video",
    category: "Videos",
    time: "Yesterday",
    score: "Completed",
    emoji: "📺",
  },
];

const DEMO_TEACHER = {
  name: "Mrs. Sharma",
  phone: "+91 98765 43210",
  email: "sharma.teacher@school.com",
  school: "Little Stars Anganwadi",
};

const DEMO_MESSAGES = [
  {
    id: 1,
    from: "teacher",
    name: "Mrs. Sharma",
    message: "Raju is doing great with alphabets! Keep practicing at home.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 2,
    from: "teacher",
    name: "Mrs. Sharma",
    message: "Tomorrow we'll start learning shapes. Please watch the shapes video today.",
    time: "Yesterday",
    read: false,
  },
];

const DEMO_ACHIEVEMENTS = [
  { id: 1, title: "First Steps", emoji: "👶", earned: true },
  { id: 2, title: "ABC Master", emoji: "🔤", earned: true },
  { id: 3, title: "Number Ninja", emoji: "🔢", earned: false },
  { id: 4, title: "Color Expert", emoji: "🎨", earned: true },
  { id: 5, title: "5 Day Streak", emoji: "🔥", earned: true },
  { id: 6, title: "Video Watcher", emoji: "📺", earned: false },
];

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [child] = useState(DEMO_CHILD);
  const [progress] = useState(DEMO_PROGRESS);
  const [activities] = useState(DEMO_RECENT_ACTIVITIES);
  const [teacher] = useState(DEMO_TEACHER);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [achievements] = useState(DEMO_ACHIEVEMENTS);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In production, send to backend API
      const newMsg = {
        id: Date.now(),
        from: "parent",
        name: user?.name || "Parent",
        message: newMessage,
        time: "Just now",
        read: true,
      };
      setMessages([newMsg, ...messages]);
      setNewMessage("");
      setShowMessageModal(false);
      alert("Message sent to teacher!");
    }
  };

  const getProgressColor = (percent) => {
    if (percent >= 80) return "#48BB78";
    if (percent >= 50) return "#ECC94B";
    return "#FC8181";
  };

  return (
    <div className="parent-dashboard">
      <Navbar />

      <main className="parent-main">
        {/* Header with Child Info */}
        <header className="parent-header">
          <div className="child-profile">
            <div className="child-avatar-large">{child.avatar}</div>
            <div className="child-details">
              <h1>{child.name}'s Learning Journey</h1>
              <p>Age: {child.age} years | Level {child.level}</p>
              <div className="child-stats-mini">
                <span>🔥 {child.streak} day streak</span>
                <span>⭐ {child.xp} XP</span>
                <span>🕐 Last active: {child.lastActive}</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/videos")}
            >
              Watch Videos Together
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="quick-stats">
          <div className="quick-stat green">
            <span className="stat-emoji">⏱️</span>
            <div>
              <h3>{child.totalTimeToday}</h3>
              <p>Today's Learning</p>
            </div>
          </div>
          <div className="quick-stat blue">
            <span className="stat-emoji">📅</span>
            <div>
              <h3>{child.totalTimeWeek}</h3>
              <p>This Week</p>
            </div>
          </div>
          <div className="quick-stat orange">
            <span className="stat-emoji">🔥</span>
            <div>
              <h3>{child.streak} Days</h3>
              <p>Current Streak</p>
            </div>
          </div>
          <div className="quick-stat purple">
            <span className="stat-emoji">🏆</span>
            <div>
              <h3>{achievements.filter((a) => a.earned).length}</h3>
              <p>Achievements</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="parent-content-grid">
          {/* Learning Progress */}
          <section className="progress-section">
            <h2>Learning Progress</h2>
            <div className="progress-list">
              {Object.entries(progress).map(([subject, data]) => (
                <div key={subject} className="progress-item">
                  <div className="progress-header">
                    <span className="subject-name">
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </span>
                    <span className="progress-text">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${data.percent}%`,
                        backgroundColor: getProgressColor(data.percent),
                      }}
                    />
                  </div>
                  <span
                    className="progress-percent"
                    style={{ color: getProgressColor(data.percent) }}
                  >
                    {data.percent}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activities */}
          <section className="activities-section">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <span className="activity-emoji">{activity.emoji}</span>
                  <div className="activity-info">
                    <h4>{activity.activity}</h4>
                    <p>{activity.category} | {activity.time}</p>
                  </div>
                  <span className="activity-score">{activity.score}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Achievements */}
        <section className="achievements-section">
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-badge ${
                  achievement.earned ? "earned" : "locked"
                }`}
              >
                <span className="badge-emoji">{achievement.emoji}</span>
                <span className="badge-title">{achievement.title}</span>
                {!achievement.earned && <span className="lock-icon">🔒</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Teacher Connection */}
        <section className="teacher-section">
          <div className="section-header">
            <h2>Your Child's Teacher</h2>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} new</span>
            )}
          </div>

          <div className="teacher-card">
            <div className="teacher-info">
              <div className="teacher-avatar">👩‍🏫</div>
              <div>
                <h3>{teacher.name}</h3>
                <p>{teacher.school}</p>
                <p className="teacher-contact">
                  📞 {teacher.phone} | ✉️ {teacher.email}
                </p>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowMessageModal(true)}
            >
              Send Message
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            <h3>Messages</h3>
            <div className="messages-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.from} ${
                    !msg.read ? "unread" : ""
                  }`}
                >
                  <div className="message-header">
                    <strong>{msg.name}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button
              className="action-card"
              onClick={() => navigate("/videos")}
            >
              <span>📺</span>
              <span>Watch Videos</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate("/alphabet")}
            >
              <span>🔤</span>
              <span>Practice Alphabets</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate("/numbers")}
            >
              <span>🔢</span>
              <span>Practice Numbers</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate("/colors")}
            >
              <span>🎨</span>
              <span>Learn Colors</span>
            </button>
          </div>
        </section>
      </main>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Message to {teacher.name}</h3>
            <p className="modal-subtitle">
              About {child.name}'s learning progress
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

export default ParentDashboard;
