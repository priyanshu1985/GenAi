import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password, formData.remember);
      // Redirect will be handled by the auth hook
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column justify-content-center">
      <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
        <Link to="/" className="d-flex justify-content-center text-decoration-none">
          <div
            className="bg-primary rounded d-flex align-items-center justify-content-center"
            style={{ width: "64px", height: "64px" }}
          >
            <svg
              style={{ width: "40px", height: "40px" }}
              className="text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
        </Link>

        <h2 className="mt-4 text-center h3 fw-bold text-dark">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center small text-muted">
          Access your learning dashboard and track progress
        </p>
      </div>

      <div className="mt-4 mx-auto w-100" style={{ maxWidth: "400px" }}>
        <div className="bg-white py-4 px-4 shadow rounded">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger small" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label small fw-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label small fw-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="form-check">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="remember" className="form-check-label small">
                  Remember me
                </label>
              </div>

              <div>
                <Link
                  to="/forgot-password"
                  className="small text-primary text-decoration-none"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="d-grid">
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                Sign in
              </Button>
            </div>

            <div className="mt-4">
              <div className="position-relative">
                <hr />
                <div
                  className="position-absolute top-50 start-50 translate-middle bg-white px-2"
                  style={{ marginTop: "-1px" }}
                >
                  <span className="small text-muted">Or continue with</span>
                </div>
              </div>

              <div className="row g-2 mt-3">
                <div className="col-6">
                  <Button
                    variant="outline"
                    className="w-100"
                    onClick={() => {
                      /* Handle Google login */
                    }}
                  >
                    <svg
                      style={{ width: "20px", height: "20px" }}
                      className="me-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                </div>

                <div className="col-6">
                  <Button
                    variant="outline"
                    className="w-100"
                    onClick={() => {
                      /* Handle GitHub login */
                    }}
                  >
                    <svg
                      style={{ width: "20px", height: "20px" }}
                      className="me-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-4">
            <div className="text-center">
              <span className="small text-muted">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary text-decoration-none">
                  Sign up here
                </Link>
              </span>
            </div>

            <div className="text-center mt-3">
              <Link to="/" className="small text-muted text-decoration-none">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
