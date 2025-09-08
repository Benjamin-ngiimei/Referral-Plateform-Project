import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const GradientButton = ({ children }) => (
  <button className="gradient-button">
    {children}
  </button>
);

const Home = () => {
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
            <Link to="/find-referrals">
              <GradientButton>
                Find Referrals
              </GradientButton>
            </Link>
            <Link to="/post-opportunities">
              <GradientButton>
                Post Opportunities
              </GradientButton>
            </Link>
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of professionals who found their dream jobs through
            referrals.
          </p>
          <GradientButton>Start Your Journey</GradientButton>
        </div>
      </section>
    </>
  );
};

export default Home;
