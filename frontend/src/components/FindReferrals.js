import React, { useState, useEffect } from 'react';
import '../css/FindReferrals.css';
import API_URL from '../config';

const FindReferrals = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [referrals, setReferrals] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await fetch(`${API_URL}/api/opportunities/all`);
                const data = await response.json();
                setReferrals(data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            }
        };

        fetchOpportunities();
    }, []);

    const filteredReferrals = referrals.filter(ref =>
        (filter === "All" || ref.type === filter) &&
        (ref.title.toLowerCase().includes(search.toLowerCase()) ||
         ref.company.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="find-referrals">
            <h2>Find Referrals</h2>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by role or company..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="All">All Types</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                </select>
            </div>
            <ul className="referral-list">
                {filteredReferrals.length === 0 ? (
                    <li>No referrals found.</li>
                ) : (
                    filteredReferrals.map((ref, index) => (
                        <li key={index}>
                            <div>
                                <strong>{ref.title}</strong> at {ref.company} <span>({ref.type})</span>
                            </div>
                            <button className="apply-btn">Apply</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default FindReferrals;
