import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Chip, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EmployeeForm.css';

const EmployeeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { employee } = location.state || {}; 

    // State to hold form values
    const [employeeName, setEmployeeName] = useState(employee ? employee.employeeName : '');
    const [loginEmail, setLoginEmail] = useState(employee ? employee.loginEmail : '');
    const [loginPassword, setLoginPassword] = useState(''); // Password field state
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState(employee ? employee.departments.map(dep => dep.departmentId) : []); 
    const [open, setOpen] = useState(false);

    // Validation States
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/departments')
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));
    }, []);

    // Email validation regex
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    // Password validation regex
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email before submission
        if (!validateEmail(loginEmail)) {
            setEmailError('Please enter a valid email (example@example.com)');
            return;
        } else {
            setEmailError('');
        }

        // If a password is provided (i.e., adding a new employee)
        if (!employee && !validatePassword(loginPassword)) {
            setPasswordError('Password must contain at least 1 uppercase letter, 1 number, and 1 special character.');
            return;
        } else {
            setPasswordError('');
        }

        const dataToSubmit = {
            employeeName,
            loginEmail,
            departmentIds: selectedDepartments
        };

        // Include password only if adding a new employee
        if (!employee) {
            dataToSubmit.loginPassword = loginPassword;
        }

        if (employee) {
            // Update employee (PUT request)
            axios.put(`http://localhost:5000/employees/update/${employee.employeeId}`, dataToSubmit)
                .then(() => {
                    alert("Employee updated successfully");
                    navigate("/employees"); // Redirect to employees list after update
                })
                .catch(err => {
                    console.error('Error updating employee:', err);
                    alert('Error updating employee.');
                });
        } else {
            // Add new employee (POST request)
            axios.post('http://localhost:5000/employees/add', dataToSubmit)
                .then(() => {
                    alert("Employee added successfully");
                    setEmployeeName('');
                    setLoginEmail('');
                    setLoginPassword('');
                    setSelectedDepartments([]);
                })
                .catch(err => {
                    console.error('Error adding employee:', err);
                    alert('Error adding employee.');
                });
        }
    };

    const handleDepartmentChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDepartments(selectedValue);

        if (selectedValue) {
            setOpen(false);  // Close dropdown after the first selection
        }
    };

    const handleDropdownOpen = () => {
        setOpen(true);
    };

    const handleDropdownClose = () => {
        setOpen(false);
    };

    return (
        <div className="employee-form-container">
            <h2>{employee ? "Update Employee" : "Add Employee"}</h2>
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Employee Name" 
                    value={employeeName} 
                    onChange={(e) => setEmployeeName(e.target.value)} 
                    fullWidth 
                    required 
                />
                <TextField 
                    label="Email" 
                    type="email" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    fullWidth 
                    required 
                    error={!!emailError} 
                    helperText={emailError} 
                />

                {/* Conditionally render password field only if it's a new employee */}
                {!employee && (
                    <TextField 
                        label="Password" 
                        type="password" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        fullWidth 
                        required 
                        error={!!passwordError} 
                        helperText={passwordError} 
                    />
                )}

                {/* Department Select with multiple options */}
                <FormControl fullWidth required>
                    <InputLabel>Departments</InputLabel>
                    <Select
                        multiple
                        value={selectedDepartments}
                        onChange={handleDepartmentChange}
                        open={open}
                        onOpen={handleDropdownOpen}
                        onClose={handleDropdownClose}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selected.map((value) => {
                                    const department = departments.find(dep => dep.departmentId === value);
                                    return department ? (
                                        <Chip key={value} label={department.departmentName} sx={{ margin: 0.5 }} />
                                    ) : (
                                        <Chip key={value} label="Unknown Department" sx={{ margin: 0.5 }} />
                                    );
                                })}
                            </Box>
                        )}
                    >
                        {departments.map(dep => (
                            <MenuItem key={dep.departmentId} value={dep.departmentId}>
                                {dep.departmentName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                    {employee ? "Update Employee" : "Add Employee"}
                </Button>
            </form>
        </div>
    );
};

export default EmployeeForm;
