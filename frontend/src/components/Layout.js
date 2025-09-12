import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X, Facebook, Twitter, Linkedin } from "lucide-react";
import "../css/Layout.css";

const GradientButton = ({ children }) => (
  <button className="gradient-button">
    {children}
  </button>
);

const Layout = ({ loggedInUser, handleLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = localStorage.getItem('admin') === 'true';
  const dashboardPath = isAdmin ? '/admin-dashboard' : '/dashboard';

  console.log('Layout: loggedInUser', loggedInUser);
  console.log('Layout: isAdmin from localStorage', localStorage.getItem('admin'));

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
            <Link to="/">ReferralHub</Link>
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
              <Link to="/features" className="nav-link">Features</Link>
            </li>
            <li>
            <Link to="/how-it-work" className="nav-link">How it work</Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {loggedInUser ? (
              <div className="user-info">
                <Link to={dashboardPath}>
                  {localStorage.getItem('userAvatar') ? (
                    <img src={localStorage.getItem('userAvatar')} alt="Avatar" className="avatar-navbar" />
                  ) : (
                    <img src="/userAvatar.png" alt="Avatar" className="avatar-navbar" />
                  )}
                </Link>
                <Link to={dashboardPath} className="user-name">{loggedInUser}</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="sign-in-button">Sign In</Link>
                <Link to="/register">
                  <GradientButton>Register</GradientButton>
                </Link>
                {/* <Link to="/admin-dashboard">
                  <button className="sign-in-button" style={{marginLeft: '8px'}}>Admin Login</button>
                </Link> */}
              </>
            )}
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
            <h3 className="footer-heading">ReferralHub</h3>
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
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Press</li>
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
