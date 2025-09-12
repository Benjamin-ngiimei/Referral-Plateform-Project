import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';
import API_URL from '../config';
import ApplicantModal from './ApplicantModal';

const AdminDashboard = () => {
  console.log('AdminDashboard component rendered');
  const admin = {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    phone: '+1 555-987-6543',
    address: '456 Admin St, Metropolis, USA',
  };

  const [postedReferrals, setPostedReferrals] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`${API_URL}/api/opportunities/all`);
        const data = await response.json();
        setPostedReferrals(data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  const [applicants, setApplicants] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false); // New state for modal visibility

  const handleViewApplicants = async (opportunityId) => {
    try {
      const response = await fetch(`${API_URL}/api/opportunities/${opportunityId}/applicants`);
      const data = await response.json();
      setApplicants(data);
      setSelectedOpportunity(opportunityId);
      setShowModal(true); // Open the modal
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOpportunity(null); // Clear selected opportunity when closing
    setApplicants([]); // Clear applicants when closing
  };

  const handleStatusUpdate = async (opportunityId, applicantReferralKey, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/opportunities/${opportunityId}/applicants/${applicantReferralKey}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Re-fetch applicants to update the table with the new status
        handleViewApplicants(opportunityId);
      } else {
        console.error('Error updating application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/edit-opportunity/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPostedReferrals(referrals => referrals.filter(ref => ref.id !== id));
      } else {
        console.error('Error deleting opportunity');
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
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
          <table className="posted-referrals-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {postedReferrals.map(ref => (
                <tr key={ref.id}>
                  <td>{ref.title}</td>
                  <td>{ref.company}</td>
                  <td>{ref.type}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(ref.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(ref.id)}>Delete</button>
                    <button className="view-applicants-btn" onClick={() => handleViewApplicants(ref.id)}>View Applicants</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {showModal && (
          <ApplicantModal
            opportunityId={selectedOpportunity}
            applicants={applicants}
            onClose={handleCloseModal}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        
      </div>
    </div>
  );
};

export default AdminDashboard;
