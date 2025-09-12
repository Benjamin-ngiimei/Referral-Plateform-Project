import React, { useState, useEffect } from 'react';
import '../css/FindReferrals.css';
import API_URL from '../config';

const FindReferrals = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [referrals, setReferrals] = useState([]);
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('referral_key'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('referral_key'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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

        const fetchAppliedOpportunities = async () => {
            const referral_key = localStorage.getItem('referral_key');
            if (referral_key) {
                try {
                    const response = await fetch(`${API_URL}/api/user/${referral_key}/opportunities`);
                    const data = await response.json();
                    setAppliedOpportunities(data.map(opp => opp.id));
                } catch (error) {
                    console.error('Error fetching applied opportunities:', error);
                }
            } else {
                setAppliedOpportunities([]); // Clear if not logged in
            }
        };

        fetchOpportunities();
        fetchAppliedOpportunities();
    }, [isLoggedIn]);

    const filteredReferrals = referrals.filter(ref =>
        (filter === "All" || ref.type === filter) &&
        (ref.title.toLowerCase().includes(search.toLowerCase()) ||
         ref.company.toLowerCase().includes(search.toLowerCase()))
    );

    const handleApply = async (opportunityId) => {
        const referral_key = localStorage.getItem('referral_key');
        console.log('FindReferrals: Current referral_key', referral_key);
        if (!referral_key) {
            console.log('FindReferrals: No referral_key, saving pending_opportunity_id', opportunityId);
            localStorage.setItem('pending_opportunity_id', opportunityId);
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/${referral_key}/opportunities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ opportunity_ids: [opportunityId] }),
            });

            if (response.ok) {
                alert('Applied successfully!');
                window.location.reload(); // Refresh the page
            } else {
                const data = await response.json();
                alert(`Error: ${data.detail || 'Failed to apply.'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message || 'Network error.'}`);
        }
    };

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
                    filteredReferrals.map((ref, index) => {
                        const isApplied = appliedOpportunities.includes(ref.id);
                        return (
                            <li key={index}>
                                <div>
                                    <strong>{ref.title}</strong> at {ref.company} <span>({ref.type})</span>
                                </div>
                                <button
                                    className={isApplied ? 'apply-btn applied-btn' : 'apply-btn'}
                                    onClick={() => handleApply(ref.id)}
                                    disabled={isApplied}
                                >
                                    {isApplied ? 'Applied' : 'Apply'}
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default FindReferrals;
