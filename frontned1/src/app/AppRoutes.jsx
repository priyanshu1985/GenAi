import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import GamifiedLearning from "../pages/GamifiedLearning";
import ColorsLearning from "../pages/ColorsLearning";
import WorkerDashboard from "../pages/WorkerDashboard";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default page = Child Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Gamified Learning */}
      <Route path="/games" element={<GamifiedLearning />} />

      {/* Colors Learning */}
      <Route path="/colors" element={<ColorsLearning />} />

      {/* Other dashboards */}
      <Route path="/worker" element={<WorkerDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
