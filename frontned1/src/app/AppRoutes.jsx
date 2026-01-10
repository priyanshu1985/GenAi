import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import GamifiedLearning from "../pages/GamifiedLearning";
import ColorsLearning from "../pages/ColorsLearning";
import WorkerDashboard from "../pages/WorkerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AlphabetLearning from "../pages/Alphabet";
import NumbersLearning from "../pages/Numbers";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ShapesLearning from "../pages/shapes";
import VoiceAssistant from "../pages/VoiceAssistant";

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "teacher" || user?.role === "worker") return <Navigate to="/worker" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route wrapper (redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "teacher" || user?.role === "worker") return <Navigate to="/worker" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Child Dashboard - Default for children/students */}
      <Route path="/" element={<ProtectedRoute allowedRoles={["child", "student", "parent"]}><Dashboard /></ProtectedRoute>} />

      {/* Learning Routes */}
      <Route path="/games" element={<ProtectedRoute><GamifiedLearning /></ProtectedRoute>} />
      <Route path="/colors" element={<ProtectedRoute><ColorsLearning /></ProtectedRoute>} />
      <Route path="/alphabet" element={<ProtectedRoute><AlphabetLearning /></ProtectedRoute>} />
      <Route path="/numbers" element={<ProtectedRoute><NumbersLearning /></ProtectedRoute>} />
      <Route path="/shapes" element={<ProtectedRoute><ShapesLearning /></ProtectedRoute>} />
      <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />

      {/* Role-specific dashboards */}
      <Route path="/worker" element={<ProtectedRoute allowedRoles={["teacher", "worker"]}><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
