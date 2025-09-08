import React, { useState } from 'react';
import '../css/Dashboard.css';

const AdminDashboard = () => {
  const admin = {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    phone: '+1 555-987-6543',
    address: '456 Admin St, Metropolis, USA',
  };

  const [postedReferrals] = useState([
    { id: 1, name: 'Backend Developer', company: 'Cloudify', type: 'Full-Time' },
    { id: 2, name: 'QA Engineer', company: 'TestPro', type: 'Contract' },
  ]);

  const [userApplications, setUserApplications] = useState([
    { id: 1, user: 'John Doe', role: 'Backend Developer', company: 'Cloudify', status: 'Pending' },
    { id: 2, user: 'Jane Smith', role: 'QA Engineer', company: 'TestPro', status: 'Accepted' },
    { id: 3, user: 'Sam Wilson', role: 'Backend Developer', company: 'Cloudify', status: 'Rejected' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setUserApplications(apps =>
      apps.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <img src={admin.avatar} alt="Avatar" className="avatar" />
        <div className="profile-info">
          <h2>{admin.name}</h2>
          <p>{admin.email}</p>
          <p><strong>Phone:</strong> {admin.phone}</p>
          <p><strong>Address:</strong> {admin.address}</p>
        </div>
      </div>

      <div className="profile-details">
        <section className="education-section">
          <h3>Posted Referrals</h3>
          <ul>
            {postedReferrals.map(ref => (
              <li key={ref.id} className="education-item">
                <strong>{ref.name}</strong> at {ref.company} <span>({ref.type})</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="employment-section">
          <h3>User Applications</h3>
          <ul className="applied-referral-list">
            {userApplications.map(app => (
              <li key={app.id} className={`applied-referral-item status-${app.status.toLowerCase()}`}>
                <div>
                  <strong>{app.user}</strong> applied for {app.role} at {app.company}
                </div>
                <div>
                  <span>{app.status}</span>
                  <button className="edit-btn" onClick={() => handleStatusChange(app.id, 'Accepted')}>Accept</button>
                  <button className="edit-btn" onClick={() => handleStatusChange(app.id, 'Rejected')}>Reject</button>
                  <button className="edit-btn" onClick={() => handleStatusChange(app.id, 'Pending')}>Pending</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
