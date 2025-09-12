import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import StartYourJourney from "./StartYourJourney";

const GradientButton = ({ children }) => (
  <button className="gradient-button">
    {children}
  </button>
);

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const referralKey = localStorage.getItem('referral_key');
      const adminStatus = localStorage.getItem('admin') === 'true';
      setIsLoggedIn(!!referralKey);
      setIsAdmin(adminStatus);
    };

    checkLoginStatus(); // Initial check

    const handleStorageChange = () => {
      checkLoginStatus(); // Re-check on storage changes
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Gateway to Dream Jobs
          </h1>
          <p className="hero-subtitle">
            Connect with professionals, get referred to top companies, and
            accelerate your career with our referral network.
          </p>
          <div className="hero-buttons">
            {!isLoggedIn && (
              <Link to="/find-referrals">
                <GradientButton>
                  Find Referrals
                </GradientButton>
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link to="/find-referrals">
                <GradientButton>
                  Find Referrals
                </GradientButton>
              </Link>
            )}
            {isLoggedIn && isAdmin && (
              <Link to="/post-opportunities">
                <GradientButton>
                  Post Opportunities
                </GradientButton>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { num: "15K+", label: "Active Users" },
            { num: "2.3K+", label: "Successful Referrals" },
            { num: "500+", label: "Partner Companies" },
            { num: "95%", label: "Success Rate" },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <h3 className="stat-number">
                {s.num}
              </h3>
              <p className="text-gray-600 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conditionally render StartYourJourney */}
      {!isLoggedIn && <StartYourJourney />}
    </>
  );
};

export default Home;
