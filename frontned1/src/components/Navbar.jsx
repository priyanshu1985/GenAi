import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../hooks/useGame";
import { useTranslation } from "react-i18next";
import { FaFire, FaHeart, FaGem } from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { gameStats } = useGame();
  const { t } = useTranslation();

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
              <span>{gameStats.current_streak}</span>
            </div>
            <div className="stat-badge hearts">
              <FaHeart className="stat-icon-nav" />
              <span>5</span>
            </div>
            <div className="stat-badge gems">
              <FaGem className="stat-icon-nav" />
              <span>{gameStats.coins}</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                {t("navigation.learn", "Learn")}
              </Link>
              <Link
                to="/videos"
                className={`nav-link ${isActive("/videos") ? "active" : ""}`}
              >
                {t("navigation.videos", "Videos")}
              </Link>
              {(user?.role === "teacher" ||
                user?.role === "worker" ||
                user?.role === "admin") && (
                <Link
                  to="/worker"
                  className={`nav-link ${isActive("/worker") ? "active" : ""}`}
                >
                  {t("navigation.dashboard", "Dashboard")}
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`nav-link ${isActive("/admin") ? "active" : ""}`}
                >
                  {t("navigation.admin", "Admin")}
                </Link>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher />

              <button onClick={logout} className="nav-btn logout-btn">
                {t("auth.logout", "Logout")}
              </button>
            </>
          ) : (
            <>
              {/* Language Switcher for non-authenticated users */}
              <LanguageSwitcher />

              <Link to="/login" className="nav-btn login-btn">
                {t("auth.login", "Login")}
              </Link>
              <Link to="/signup" className="nav-btn signup-btn">
                {t("auth.getStarted", "Get Started")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
