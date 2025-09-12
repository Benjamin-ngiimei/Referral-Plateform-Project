import React, { useState } from 'react';
import '../css/PostOpportunities.css';
import API_URL from '../config'; // Import API_URL

const PostOpportunities = () => {
    const [form, setForm] = useState({
        title: '',
        company: '',
        type: 'Full-Time',
        description: '',
        email: localStorage.getItem('loggedInUserEmail') || '' // Add email field
    });
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState(''); // Add state for messages

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => { // Make handleSubmit async
        e.preventDefault();
        setMessage(''); // Clear previous messages

        try {
            const response = await fetch(`${API_URL}/api/opportunities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form), // Send the form data
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setMessage(data.message || 'Opportunity posted successfully!');
                setForm({ // Clear the form after successful submission
                    title: '',
                    company: '',
                    type: 'Full-Time',
                    description: ''
                });
                setTimeout(() => {
                    window.location.href = '/post-opportunities';
                }, 1000);
            } else {
                setMessage(`Error: ${data.detail || 'Failed to post opportunity.'}`);
                setSubmitted(false);
            }
        } catch (error) {
            setMessage(`Error: ${error.message || 'Network error or unexpected issue.'}`);
            setSubmitted(false);
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
            {message && <p className={submitted ? 'success-message' : 'error-message'}>{message}</p>}
        </div>
    );
};

export default PostOpportunities;
