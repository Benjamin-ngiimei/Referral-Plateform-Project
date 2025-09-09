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
    const handleSubmit = e => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would send form data to backend
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
