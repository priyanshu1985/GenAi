import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center px-3">
      <div className="w-100 text-center" style={{ maxWidth: "400px" }}>
        {/* 404 Illustration */}
        <div className="mb-5">
          <div
            className="mx-auto bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4"
            style={{ width: "128px", height: "128px" }}
          >
            <svg
              style={{ width: "64px", height: "64px" }}
              className="text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8.5a9.5 9.5 0 109.5 9.5A9.5 9.5 0 0012 3.5z"
              />
            </svg>
          </div>

          <h1 className="display-1 fw-bold text-dark mb-2">404</h1>
          <h2 className="h4 fw-semibold text-secondary mb-3">Page Not Found</h2>
        </div>

        {/* Error Message */}
        <div className="mb-5">
          <p className="text-muted lead mb-3">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-muted small">
            Don't worry, let's get you back on track with your learning journey!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-3">
          <Link to="/">
            <Button size="large" className="w-100">
              <svg
                style={{ width: "20px", height: "20px" }}
                className="me-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Home
            </Button>
          </Link>

          <Link to="/child-session">
            <Button size="large" variant="outline" className="w-100">
              <svg
                style={{ width: "20px", height: "20px" }}
                className="me-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Start Learning
            </Button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn btn-link text-primary small"
          >
            ← Go back to previous page
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-5 pt-4 border-top">
          <p className="small text-muted mb-3">
            Need help? Try these popular pages:
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/child-session" className="small text-primary">
              Child Session
            </Link>
            <Link to="/worker-dashboard" className="small text-primary">
              Worker Dashboard
            </Link>
            <Link to="/login" className="small text-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
