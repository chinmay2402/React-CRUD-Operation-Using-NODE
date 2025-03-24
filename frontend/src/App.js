import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddEmployeePage from './pages/AddEmployeePage';
import AddDepartmentPage from './pages/AddDepartmentPage';
import EmployeeListPage from './pages/EmployeeListPage';

const App = () => (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-employee" element={<AddEmployeePage />} />
            <Route path="/add-department" element={<AddDepartmentPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
        </Routes>
    </Router>
);

export default App;
