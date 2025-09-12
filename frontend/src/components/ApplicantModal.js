import React from 'react';
import '../css/ApplicantModal.css';

const ApplicantModal = ({ opportunityId, applicants, onClose, onStatusUpdate }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Applicants for Opportunity {opportunityId}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {applicants.length === 0 ? (
            <p>No applicants for this opportunity yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(applicant => (
                  <tr key={applicant.referral_key}>
                    <td>{applicant.name}</td>
                    <td>{applicant.email}</td>
                    <td>{applicant.status}</td>
                    <td>
                      <select
                        value={applicant.status}
                        onChange={(e) => onStatusUpdate(opportunityId, applicant.referral_key, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;