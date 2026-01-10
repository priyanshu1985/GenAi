import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🦉</span>
          <span className="footer-name">SikshaAI</span>
        </div>
        <p className="footer-tagline">Making learning fun for every child</p>
        <div className="footer-features">
          <span className="feature-tag">🎤 Voice-first</span>
          <span className="feature-tag">🌍 Multilingual</span>
          <span className="feature-tag">📱 Offline-ready</span>
        </div>
        <p className="footer-copyright">© 2026 SikshaAI Learning Assistant</p>
      </div>
    </footer>
  );
};

export default Footer;
