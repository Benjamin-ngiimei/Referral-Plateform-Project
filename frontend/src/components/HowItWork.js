import React from 'react';
import '../css/HowItWork.css';

const HowItWork = () => {
  return (
    <div className="how-it-work-container">
      <h2>How It Works</h2>
      <div className="steps-list">
        <div className="step-item">
          <h3>1. Register/Login</h3>
          <p>Create your account or log in to access the platform's features.</p>
        </div>
        <div className="step-item">
          <h3>2. Find Opportunities</h3>
          <p>Browse through a wide range of job opportunities posted by companies.</p>
        </div>
        <div className="step-item">
          <h3>3. Apply or Refer</h3>
          <p>Apply directly to jobs or refer your friends and colleagues.</p>
        </div>
        <div className="step-item">
          <h3>4. Track Progress</h3>
          <p>Monitor the status of your applications and referrals in your dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;