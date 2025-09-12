import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config';

const EditOpportunity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        company: '',
        type: 'Full-Time',
        description: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(`${API_URL}/api/opportunities/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setForm(data);
                } else {
                    setMessage('Opportunity not found');
                }
            } catch (error) {
                console.error('Error fetching opportunity:', error);
            }
        };

        fetchOpportunity();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Opportunity updated successfully!');
                setTimeout(() => navigate('/admin-dashboard'), 1200);
            } else {
                setMessage(`Error: ${data.detail}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.toString()}`);
        }
    };

    return (
        <div className="post-opportunities">
            <h2>Edit Opportunity</h2>
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
                <button type="submit">Update Opportunity</button>
            </form>
            {message && <div className="success-message">{message}</div>}
        </div>
    );
};

export default EditOpportunity;