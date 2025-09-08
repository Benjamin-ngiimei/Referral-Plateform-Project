import React, { useState } from 'react';
import '../css/FindReferrals.css';

const FindReferrals = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const referrals = [
        { id: 1, name: "Software Engineer", company: "TechCorp", type: "Full-Time" },
        { id: 2, name: "Data Analyst", company: "DataWorks", type: "Internship" },
        { id: 3, name: "Product Manager", company: "InnovateX", type: "Full-Time" },
        { id: 4, name: "UI/UX Designer", company: "Designify", type: "Contract" },
        { id: 5, name: "Backend Developer", company: "Cloudify", type: "Full-Time" },
        { id: 6, name: "Frontend Developer", company: "Webify", type: "Internship" },
        { id: 7, name: "QA Engineer", company: "TestPro", type: "Contract" },
        { id: 8, name: "DevOps Engineer", company: "OpsGen", type: "Full-Time" },
        { id: 9, name: "Business Analyst", company: "BizInsight", type: "Full-Time" },
        { id: 10, name: "Mobile App Developer", company: "Appify", type: "Internship" },
    ];

    const filteredReferrals = referrals.filter(ref =>
        (filter === "All" || ref.type === filter) &&
        (ref.name.toLowerCase().includes(search.toLowerCase()) ||
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
                    filteredReferrals.map(ref => (
                        <li key={ref.id}>
                            <div>
                                <strong>{ref.name}</strong> at {ref.company} <span>({ref.type})</span>
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
