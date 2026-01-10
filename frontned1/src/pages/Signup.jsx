import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import "../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "child",
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name,
      });
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
      setError(err.message || "Signup failed. Please try again.");
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
              <span className="auth-emoji">🎉</span>
              <h2>Join Us!</h2>
              <p>Create an account to start learning</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label>I am a...</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="auth-input"
                >
                  <option value="child">Child / Student</option>
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher / Worker</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
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
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </Form>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Login
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Signup;
