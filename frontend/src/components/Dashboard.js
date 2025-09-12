import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import API_URL from '../config';

const Dashboard = () => {
  console.log('Dashboard component rendered');
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
    phone: '+1 555-123-4567',
    address: '123 Main St, Springfield, USA',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const referral_key = localStorage.getItem('referral_key');
    if (!referral_key) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/user/${referral_key}/data`)
      .then(res => res.json())
      .then(data => {
        setUser({
          name: data.name,
          email: data.email,
          avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.email}`,
          phone: data.phone || '+1 555-123-4567',
          address: data.address || '123 Main St, Springfield, USA',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const education = [
    {
      school: 'Springfield University',
      degree: 'B.Sc.',
      field: 'Computer Science',
      year: 2022,
    },
    {
      school: 'Springfield High School',
      degree: 'High School Diploma',
      field: 'Science',
      year: 2018,
    },
  ];

  const employment = [
    {
      company: 'TechCorp',
      position: 'Software Engineer',
      years: '2022 - Present',
      description: 'Developing web applications and APIs.'
    },
    {
      company: 'Webify',
      position: 'Intern',
      years: '2021 - 2022',
      description: 'Assisted in frontend development and testing.'
    },
  ];
  const [appliedReferrals, setAppliedReferrals] = useState([]);

  useEffect(() => {
    const fetchAppliedReferrals = async () => {
      const referral_key = localStorage.getItem('referral_key');
      if (referral_key) {
        try {
          const response = await fetch(`${API_URL}/api/user/${referral_key}/opportunities`);
          const data = await response.json();
          setAppliedReferrals(data);
        } catch (error) {
          console.error('Error fetching applied referrals:', error);
        }
      }
    };

    fetchAppliedReferrals();
  }, []);

  if (loading) {
    return <div className="dashboard-container"><p>Loading profile...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <img src={user.avatar} alt="Avatar" className="avatar" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
      </div>

      <div className="profile-details">
        <section className="education-section">
          <h3>Education</h3>
          <ul>
            {education.map((edu, idx) => (
              <li key={idx} className="education-item">
                <strong>{edu.school}</strong> ({edu.year})<br />
                {edu.degree} in {edu.field}
              </li>
            ))}
          </ul>
        </section>

        <section className="employment-section">
          <h3>Employment</h3>
          <ul>
            {employment.map((job, idx) => (
              <li key={idx} className="employment-item">
                <strong>{job.position}</strong> at {job.company} <span>({job.years})</span><br />
                <span>{job.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="applied-referrals-section">
        <h3>Referrals You've Applied To</h3>
        <ul className="applied-referral-list">
          {appliedReferrals.map(ref => (
            <li key={ref.id} className={`applied-referral-item status-${ref.status ? ref.status.toLowerCase() : ''}`}>
              <div>
                <strong>{ref.title}</strong> at {ref.company}
              </div>
              {ref.status && <span>Status: {ref.status}</span>} 
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
