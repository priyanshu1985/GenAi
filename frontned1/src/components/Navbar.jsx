import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../hooks/useGame";
import { useTranslation } from "react-i18next";
import { FaFire, FaGem, FaStar, FaBars, FaTimes } from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { gameStats } = useGame();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🦉</span>
          <span className="logo-text">SikshaAI</span>
        </Link>

        {/* Stats Bar - Only show when authenticated */}
        {isAuthenticated && (
          <div className="navbar-stats">
            <div className="stat-badge streak" title="Daily Streak">
              <FaFire className="stat-icon-nav" />
              <span>{gameStats?.current_streak || 0}</span>
            </div>
            <div className="stat-badge gems" title="Coins Earned">
              <FaGem className="stat-icon-nav" />
              <span>{gameStats?.coins || 0}</span>
            </div>
            <div className="stat-badge level" title="Current Level">
              <FaStar className="stat-icon-nav" />
              <span>Lv {gameStats?.level || 1}</span>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">📚</span>
                <span className="nav-text">{t("navigation.learn", "Learn")}</span>
              </Link>
              <Link
                to="/videos"
                className={`nav-link ${isActive("/videos") ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">🎬</span>
                <span className="nav-text">{t("navigation.videos", "Videos")}</span>
              </Link>

              {/* Role-based links */}
              {user?.role === "parent" && (
                <Link
                  to="/parent"
                  className={`nav-link ${isActive("/parent") ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">👪</span>
                  <span className="nav-text">{t("navigation.parent", "Parent")}</span>
                </Link>
              )}

              {(user?.role === "teacher" || user?.role === "worker") && (
                <Link
                  to="/teacher"
                  className={`nav-link ${isActive("/teacher") || isActive("/worker") ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">👨‍🏫</span>
                  <span className="nav-text">{t("navigation.teacher", "Teacher")}</span>
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`nav-link ${isActive("/admin") ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">{t("navigation.admin", "Admin")}</span>
                </Link>
              )}

              {/* Language Switcher */}
              <div className="nav-divider"></div>
              <LanguageSwitcher />

              <button onClick={() => { logout(); closeMobileMenu(); }} className="nav-btn logout-btn">
                <span className="btn-icon">🚪</span>
                <span>{t("auth.logout", "Logout")}</span>
              </button>
            </>
          ) : (
            <>
              {/* Language Switcher for non-authenticated users */}
              <LanguageSwitcher />

              <Link to="/login" className="nav-btn login-btn" onClick={closeMobileMenu}>
                {t("auth.login", "Login")}
              </Link>
              <Link to="/signup" className="nav-btn signup-btn" onClick={closeMobileMenu}>
                {t("auth.getStarted", "Get Started")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Overlay */}
        {mobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
      </div>
    </nav>
  );
};

export default Navbar;
