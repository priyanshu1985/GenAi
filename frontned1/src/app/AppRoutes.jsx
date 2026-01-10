import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import GamifiedLearning from "../pages/GamifiedLearning";
import ColorsLearning from "../pages/ColorsLearning";
import WorkerDashboard from "../pages/WorkerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import ParentDashboard from "../pages/ParentDashboard";
import AlphabetLearning from "../pages/Alphabet";
import NumbersLearning from "../pages/Numbers";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ShapesLearning from "../pages/shapes";
import VoiceAssistant from "../pages/VoiceAssistant";
import VideoPage from "../pages/VideoPage";

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "teacher") return <Navigate to="/teacher" replace />;
    if (user?.role === "worker") return <Navigate to="/worker" replace />;
    if (user?.role === "parent") return <Navigate to="/parent" replace />;
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
    if (user?.role === "teacher") return <Navigate to="/teacher" replace />;
    if (user?.role === "worker") return <Navigate to="/worker" replace />;
    if (user?.role === "parent") return <Navigate to="/parent" replace />;
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
      <Route path="/" element={<ProtectedRoute allowedRoles={["child", "student"]}><Dashboard /></ProtectedRoute>} />

      {/* Learning Routes - Accessible to children and parents */}
      <Route path="/games" element={<ProtectedRoute><GamifiedLearning /></ProtectedRoute>} />
      <Route path="/colors" element={<ProtectedRoute><ColorsLearning /></ProtectedRoute>} />
      <Route path="/alphabet" element={<ProtectedRoute><AlphabetLearning /></ProtectedRoute>} />
      <Route path="/numbers" element={<ProtectedRoute><NumbersLearning /></ProtectedRoute>} />
      <Route path="/shapes" element={<ProtectedRoute><ShapesLearning /></ProtectedRoute>} />
      <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />
      <Route path="/videos" element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />

      {/* Role-specific dashboards */}
      <Route path="/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute allowedRoles={["parent"]}><ParentDashboard /></ProtectedRoute>} />
      <Route path="/worker" element={<ProtectedRoute allowedRoles={["worker"]}><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
