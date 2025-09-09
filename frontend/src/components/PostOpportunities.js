import React, { useState } from 'react';
import '../css/PostOpportunities.css';

const PostOpportunities = () => {
    const [form, setForm] = useState({
        title: '',
        company: '',
        type: 'Full-Time',
        description: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const userEmail = localStorage.getItem('loggedInUser'); // Assuming loggedInUser stores the email
        if (!userEmail) {
            alert('User not logged in. Please log in to post an opportunity.');
            return;
        }

        try {
            const response = await fetch('/api/opportunities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...form, email: userEmail }),
            });

            if (response.ok) {
                setSubmitted(true);
                setForm({
                    title: '',
                    company: '',
                    type: 'Full-Time',
                    description: ''
                });
            } else {
                const errorData = await response.json();
                alert(`Failed to post opportunity: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            alert(`Error posting opportunity: ${error.message}`);
        }
    };

    return (
        <div className="post-opportunities">
            <h2>Post Opportunities</h2>
            <form onSubmit={handleSubmit} className="opportunity-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Opportunity Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={form.company}
                    onChange={handleChange}
                    required
                />
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                </select>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Post Opportunity</button>
            </form>
            {submitted && <div className="success-message">Opportunity posted successfully!</div>}
        </div>
    );
};

export default PostOpportunities;
