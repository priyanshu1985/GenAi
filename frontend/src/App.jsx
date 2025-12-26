import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import useOffline from "./hooks/useOffline";
import authService from "./services/authService";

// Pages
import Home from "./pages/Home";
import ChildSession from "./pages/ChildSession";
import WorkerDashboard from "./pages/WorkerDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Components
import Loader from "./components/common/Loader";

// Main stylesheet is imported in main.jsx

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const { isOnline, isOffline } = useOffline();

  // Initialize the application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize authentication service
        await authService.initialize();

        // Register service worker for PWA functionality
        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.register(
              "/service-worker.js"
            );
            console.log("Service Worker registered:", registration);
          } catch (swError) {
            console.warn("Service Worker registration failed:", swError);
          }
        }

        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize app:", err);
        setError(err.message);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Learning Hub
          </h1>
          <Loader
            message="Initializing application..."
            size="medium"
            color="blue"
          />
        </div>
      </div>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Initialization Failed
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen bg-gray-50">
          {/* Offline indicator */}
          {isOffline && (
            <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm font-medium">
              ⚠️ You are currently offline. Some features may be limited.
            </div>
          )}

          {/* Main application routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/child-session" element={<ChildSession />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>

          {/* PWA install prompt (would be implemented here) */}
          {/* Toast notifications container (would be implemented here) */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
