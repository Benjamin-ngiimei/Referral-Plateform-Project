import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X, Facebook, Twitter, Linkedin } from "lucide-react";
import "./Layout.css";

const GradientButton = ({ children }) => (
  <button className="gradient-button">
    {children}
  </button>
);

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="layout-container">
      {/* Navbar */}
      <header className={`main-header ${isScrolled ? "scrolled-header" : ""}`}>
        <nav className="main-nav">
          <div className="logo">
            <Link to="/">🔗 ReferralHub</Link>
          </div>

          {/* Desktop Nav */}
          <ul className="desktop-nav">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">About us</Link>
            </li>
            <li>
              <Link to="/" className="nav-link">features</Link>
            </li>
            <li>
            <Link to="/" className="nav-link">How it work</Link>
            </li>
            <li>
              <Link to="/" className="nav-link">Contact</Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <button className="sign-in-button">Sign In</button>
            <GradientButton>Get Started</GradientButton>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div>
            <h3 className="footer-heading">🔗 ReferralHub</h3>
            <p>
              Connecting talented professionals with opportunities through the
              power of referrals.
            </p>
          </div>
          <div>
            <ul className="footer-links">
              <li>Find Referrals</li>
              <li>Post Jobs</li>
              <li>Dashboard</li>
              <li>Messages</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/press">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 ReferralHub. All rights reserved.</p>
          <div className="social-icons">
            <Facebook size={20} className="social-icon" />
            <Twitter size={20} className="social-icon" />
            <Linkedin size={20} className="social-icon" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
