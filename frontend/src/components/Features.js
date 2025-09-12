import React from 'react';
import '../css/Features.css';

const Features = () => {
  return (
    <div className="features-container">
      <h2>Our Key Features</h2>
      <div className="feature-list">
        <div className="feature-item">
          <h3>Seamless Referrals</h3>
          <p>Easily refer your network to exciting job opportunities and track their progress.</p>
        </div>
        <div className="feature-item">
          <h3>Opportunity Matching</h3>
          <p>Discover relevant job openings tailored to your skills and preferences.</p>
        </div>
        <div className="feature-item">
          <h3>Real-time Tracking</h3>
          <p>Stay updated on the status of your referrals and applications with real-time notifications.</p>
        </div>
        <div className="feature-item">
          <h3>Admin Dashboard</h3>
          <p>For administrators, a comprehensive dashboard to manage opportunities, view applicants, and update statuses.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;