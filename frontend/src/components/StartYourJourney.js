import React from 'react';
import { Link } from 'react-router-dom';
import '../css/StartYourJourney.css';

const StartYourJourney = () => {
  return (
    <div className="start-journey-container">
      <h2>Ready to Start Your Journey?</h2>
      <p>Join ReferralHub today and unlock a world of opportunities and connections.</p>
      <div className="journey-buttons">
        <Link to="/register" className="journey-register-btn">Get Started</Link>
        <Link to="/find-referrals" className="journey-find-btn">Explore Opportunities</Link>
      </div>
    </div>
  );
};

export default StartYourJourney;