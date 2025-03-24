const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chinmay@1824',
    database: 'test'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Add Employee with Department(s)
app.post('/employees/add', (req, res) => {
    const { employeeName, loginEmail, loginPassword, departmentIds } = req.body; // departmentIds = array of departmentId(s)

    if (!departmentIds || departmentIds.length === 0) {
        return res.status(400).json({ error: "At least one department must be selected." });
    }

    // Insert Employee
    const insertEmployeeQuery = 'INSERT INTO employee (employeeName, loginEmail, loginPassword) VALUES (?, ?, ?)';
    db.query(insertEmployeeQuery, [employeeName, loginEmail, loginPassword], (err, result) => {
        if (err) return res.status(500).json(err);

        const employeeId = result.insertId;

        // Insert into employeeDepartment table
        const insertEmployeeDeptQuery = 'INSERT INTO employeeDepartment (employeeId, departmentId) VALUES ?';
        const values = departmentIds.map(departmentId => [employeeId, departmentId]);

        db.query(insertEmployeeDeptQuery, [values], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Employee added with departments", employeeId });
        });
    });
});

app.put('/employees/update/:id', (req, res) => {
    const employeeId = req.params.id;
    const { employeeName, loginEmail, departmentIds } = req.body;

    if (!employeeName || !loginEmail || !departmentIds || departmentIds.length === 0) {
        return res.status(400).json({ error: "Employee name, email, and at least one department are required." });
    }

    // First, update the employee details
    const updateEmployeeQuery = 'UPDATE employee SET employeeName = ?, loginEmail = ? WHERE employeeId = ?';
    db.query(updateEmployeeQuery, [employeeName, loginEmail, employeeId], (err, result) => {
        if (err) return res.status(500).json(err);

        // Now update the employeeDepartment table to reflect the new departments
        // First, delete the current department associations for this employee
        const deleteEmployeeDeptQuery = 'DELETE FROM employeeDepartment WHERE employeeId = ?';
        db.query(deleteEmployeeDeptQuery, [employeeId], (err) => {
            if (err) return res.status(500).json(err);

            // Insert new department associations
            const insertEmployeeDeptQuery = 'INSERT INTO employeeDepartment (employeeId, departmentId) VALUES ?';
            const values = departmentIds.map(departmentId => [employeeId, departmentId]);

            db.query(insertEmployeeDeptQuery, [values], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Employee updated successfully" });
            });
        });
    });
});


app.get('/employees', (req, res) => {
    const sql = `
        SELECT e.employeeId, e.employeeName, e.loginEmail, 
               d.departmentId, d.departmentName
        FROM employee e
        LEFT JOIN employeeDepartment ed ON e.employeeId = ed.employeeId
        LEFT JOIN department d ON ed.departmentId = d.departmentId
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Transform result to group departments under employees
        const employees = {};
        
        results.forEach(row => {
            if (!employees[row.employeeId]) {
                employees[row.employeeId] = {
                    employeeId: row.employeeId,
                    employeeName: row.employeeName,
                    loginEmail: row.loginEmail,
                    departments: []  // Ensure departments is always an array
                };
            }
            if (row.departmentId) {
                employees[row.employeeId].departments.push({
                    departmentId: row.departmentId,
                    departmentName: row.departmentName
                });
            }
        });

        res.json(Object.values(employees));
    });
});

app.delete('/employee/:id', (req, res) => {
    const employeeId = req.params.id;
    const sql = 'DELETE FROM employee WHERE employeeId = ?';
    const sql2 = 'DELETE FROM employeeDepartment where employeeId = ?';

    db.query(sql2, [employeeId], () => {
      });

    db.query(sql, [employeeId], (err) => {
      if (err) {
        console.error("Error deleting employee:", err);
        return res.status(500).send('Server error');
      }
      res.send('employee deleted successfully');
    });
  });
  
// Get All Departments
app.get('/departments', (req, res) => {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// ✅ **API to Add a New Department**
app.post('/departments', (req, res) => {
    const { departmentName } = req.body;
    
    if (!departmentName) {
        return res.status(400).json({ error: 'Department name is required' });
    }

    const sql = 'INSERT INTO department (departmentName) VALUES (?)';
    db.query(sql, [departmentName], (err, result) => {
        if (err) {
            console.error('Error adding department:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Department added successfully', departmentId: result.insertId });
    });
});

// ✅ **API to Fetch All Departments**
app.get('/departments', (req, res) => {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});


app.listen(5000, () => console.log('Server running on port 5000'));
