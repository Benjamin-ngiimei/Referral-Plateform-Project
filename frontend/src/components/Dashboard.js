import React from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    phone: '+1 555-123-4567',
    address: '123 Main St, Springfield, USA',
  };

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

  const appliedReferrals = [
    { id: 1, name: 'Software Engineer', company: 'TechCorp', status: 'Pending' },
    { id: 2, name: 'Data Analyst', company: 'DataWorks', status: 'Accepted' },
    { id: 3, name: 'UI/UX Designer', company: 'Designify', status: 'Rejected' },
  ];

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
            <li key={ref.id} className={`applied-referral-item status-${ref.status.toLowerCase()}`}>
              <div>
                <strong>{ref.name}</strong> at {ref.company}
              </div>
              <span>{ref.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
