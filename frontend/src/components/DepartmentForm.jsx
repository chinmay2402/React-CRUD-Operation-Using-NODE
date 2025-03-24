import React, { useState } from 'react';
import axios from 'axios';
import '../styles/DepartmentForm.css';

const AddDepartment = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!departmentName.trim()) {
            alert("Department name is required");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/departments', { departmentName });
            setMessage(response.data.message);
            setDepartmentName('');
        } catch (error) {
            console.error('Error adding department:', error);
            setMessage('Failed to add department');
        }
    };

    return (
        <div className="add-department-container">
            <h2>Add Department</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Enter department name" 
                    value={departmentName} 
                    onChange={(e) => setDepartmentName(e.target.value)} 
                />
                <button type="submit">Add Department</button>
            </form>
        </div>
    );
};

export default AddDepartment;
