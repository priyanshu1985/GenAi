import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaFire, FaHeart, FaGem } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🦉</span>
          <span className="logo-text">SikshaAI</span>
        </Link>

        {/* Stats Bar - Only show when authenticated */}
        {isAuthenticated && (
          <div className="navbar-stats">
            <div className="stat-badge streak">
              <FaFire className="stat-icon-nav" />
              <span>3</span>
            </div>
            <div className="stat-badge hearts">
              <FaHeart className="stat-icon-nav" />
              <span>5</span>
            </div>
            <div className="stat-badge gems">
              <FaGem className="stat-icon-nav" />
              <span>120</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                Learn
              </Link>
              {(user?.role === "teacher" || user?.role === "worker" || user?.role === "admin") && (
                <Link to="/worker" className={`nav-link ${isActive("/worker") ? "active" : ""}`}>
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
                  Admin
                </Link>
              )}
              <button onClick={logout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn">
                Login
              </Link>
              <Link to="/signup" className="nav-btn signup-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
