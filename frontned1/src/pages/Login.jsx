import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
