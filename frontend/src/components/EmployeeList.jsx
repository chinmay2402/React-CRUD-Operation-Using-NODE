import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import '../styles/EmployeeList.css';


const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [RefreshTrigger ,setRefreshTrigger] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:5000/employees")
            .then((response) => setEmployees(response.data))
            .catch((error) => console.error("Error fetching employees:", error));
    }, [RefreshTrigger]);

const handledelete = async (employeeId) => {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
    if (confirmed){
        console.log("employeeId", employeeId);
    const response = await axios.delete (`http://localhost:5000/employee/${employeeId}`);
    setRefreshTrigger((prev) => !prev);
    }
};

const handleUpdate = (employee) =>{
    navigate('/add-employee', {state:{employee}})
    console.log("employee", employee);
}

    return (
        <div className="employee-list-container" style={{ margin: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Employee List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Departments</strong></TableCell>
                            <TableCell><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.employeeId}>
                                <TableCell>{employee.employeeId}</TableCell>
                                <TableCell>{employee.employeeName}</TableCell>
                                <TableCell>{employee.loginEmail}</TableCell>
                                <TableCell>
                                    {Array.isArray(employee.departments) && employee.departments.length > 0
                                        ? employee.departments.map(dept => dept.departmentName).join(", ")
                                        : "No Department"}
                                </TableCell>
                                <TableCell>
                                    <DeleteIcon
                                        onClick = {() => handledelete(employee.employeeId)} 
                                        className = "action-icon"
                                        />
                                        <UpdateIcon
                                        onClick = {() => handleUpdate(employee)}
                                        className="action-icon"
                                        />
                                        </TableCell>
                                        
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default EmployeeList;
