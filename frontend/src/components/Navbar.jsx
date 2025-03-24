import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            {/* Hamburger menu */}
            <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </div>

            {/* Navbar links - shown only if isOpen is true */}
            <div className={`nav-links ${isOpen ? "open" : ""}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/add-employee" onClick={() => setIsOpen(false)}>Add Employee</Link>
                <Link to="/add-department" onClick={() => setIsOpen(false)}>Add Department</Link>
                <Link to="/employees" onClick={() => setIsOpen(false)}>Employee List</Link>
            </div>
        </nav>
    );
};

export default Navbar;
