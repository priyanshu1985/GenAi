import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TempApp from "./TempApp.jsx";

// Import the main stylesheet
import "./index.css";

// Error boundary component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error, errorInfo);

    // You could send error to logging service here
    // logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
          <div className="text-center" style={{ maxWidth: "400px" }}>
            <div
              className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{ width: "64px", height: "64px" }}
            >
              <svg
                style={{ width: "32px", height: "32px" }}
                className="text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="h5 fw-bold text-dark mb-2">
              Something went wrong
            </h1>
            <p className="text-muted mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the React application
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <TempApp />
    </ErrorBoundary>
  </StrictMode>
);
