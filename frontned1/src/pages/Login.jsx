import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import "../styles/Auth.css";

// Test credentials for easy testing
const TEST_ACCOUNTS = [
  { role: "Child", email: "mankepriyanshu19@gmail.com", password: "Priyanshu@19", emoji: "👶" },
  { role: "Teacher", email: "prachibhagat999@gmail.com", password: "Prachi@123", emoji: "👨‍🏫" },
  { role: "Parent", email: "pranalizagade2005@gmail.com", password: "Pranali@123", emoji: "👪" },
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick fill test credentials
  const fillTestCredentials = (account) => {
    setFormData({
      email: account.email,
      password: account.password,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      const { user, token } = response.data;

      login({ ...user, token });

      // Redirect based on role
      if (user.role === "child" || user.role === "student") {
        navigate("/");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "teacher" || user.role === "worker") {
        navigate("/worker");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container className="auth-wrapper">
        <Card className="auth-card">
          <Card.Body>
            <div className="auth-logo">
              <span className="auth-logo-icon">🦉</span>
              <span className="auth-logo-text">SikshaAI</span>
            </div>

            <div className="auth-header">
              <span className="auth-emoji">👋</span>
              <h2>Welcome Back!</h2>
              <p>Login to continue learning</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            {/* Test Credentials Section */}
            <div className="test-credentials" style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f0f9ff",
              borderRadius: "12px",
              border: "1px dashed #1CB0F6"
            }}>
              <p style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "10px",
                textAlign: "center",
                fontWeight: "600"
              }}>
                Quick Login (Test Accounts)
              </p>
              <div style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}>
                {TEST_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => fillTestCredentials(account)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "12px",
                      border: "none",
                      borderRadius: "20px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "transform 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                  >
                    <span>{account.emoji}</span>
                    <span>{account.role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login;
