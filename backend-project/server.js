const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cwsms'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key_2025';

// ============ AUTHENTICATION ENDPOINTS ============

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.query('INSERT INTO User (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM User WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const user = results[0];
            const isValid = await bcrypt.compare(password, user.password);
            
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
            res.json({ token, username: user.username });
        }
    );
});

// ============ CAR ENDPOINTS ============

// Get all cars
app.get('/api/cars', (req, res) => {
    db.query('SELECT * FROM Car', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create car
app.post('/api/cars', (req, res) => {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    
    db.query(
        'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
        [PlateNumber, CarType, CarSize, DriverName, PhoneNumber],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Car added successfully', id: PlateNumber });
        }
    );
});

// Update car
app.put('/api/cars/:plateNumber', (req, res) => {
    const { plateNumber } = req.params;
    const { CarType, CarSize, DriverName, PhoneNumber } = req.body;
    
    db.query(
        'UPDATE Car SET CarType=?, CarSize=?, DriverName=?, PhoneNumber=? WHERE PlateNumber=?',
        [CarType, CarSize, DriverName, PhoneNumber, plateNumber],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Car updated successfully' });
        }
    );
});

// Delete car
app.delete('/api/cars/:plateNumber', (req, res) => {
    const { plateNumber } = req.params;
    
    db.query('DELETE FROM Car WHERE PlateNumber=?', [plateNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Car deleted successfully' });
    });
});

// ============ PACKAGE ENDPOINTS ============

// Get all packages
app.get('/api/packages', (req, res) => {
    db.query('SELECT * FROM Package', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create package
app.post('/api/packages', (req, res) => {
    const { PackageNumber, PackageName, PackageDescription, PackagePrice } = req.body;
    
    db.query(
        'INSERT INTO Package (PackageNumber, PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?, ?)',
        [PackageNumber, PackageName, PackageDescription, PackagePrice],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Package added successfully' });
        }
    );
});

// Update package
app.put('/api/packages/:packageNumber', (req, res) => {
    const { packageNumber } = req.params;
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    
    db.query(
        'UPDATE Package SET PackageName=?, PackageDescription=?, PackagePrice=? WHERE PackageNumber=?',
        [PackageName, PackageDescription, PackagePrice, packageNumber],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Package updated successfully' });
        }
    );
});

// Delete package
app.delete('/api/packages/:packageNumber', (req, res) => {
    const { packageNumber } = req.params;
    
    db.query('DELETE FROM Package WHERE PackageNumber=?', [packageNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Package deleted successfully' });
    });
});

// ============ SERVICE PACKAGE ENDPOINTS ============

// Get all service records
app.get('/api/services', (req, res) => {
    db.query(`
        SELECT sp.*, c.PlateNumber, c.DriverName, c.CarType, 
               p.PackageName, p.PackageDescription, p.PackagePrice
        FROM ServicePackage sp
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package p ON sp.PackageNumber = p.PackageNumber
        ORDER BY sp.RecordNumber DESC
    `, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create service record
app.post('/api/services', (req, res) => {
    const { RecordNumber, SeviceDate, PlateNumber, PackageNumber } = req.body;
    
    db.query(
        'INSERT INTO ServicePackage (RecordNumber, SeviceDate, PlateNumber, PackageNumber) VALUES (?, ?, ?, ?)',
        [RecordNumber, SeviceDate, PlateNumber, PackageNumber],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Service record added successfully' });
        }
    );
});

// Update service record
app.put('/api/services/:recordNumber', (req, res) => {
    const { recordNumber } = req.params;
    const { SeviceDate, PlateNumber, PackageNumber } = req.body;
    
    db.query(
        'UPDATE ServicePackage SET SeviceDate=?, PlateNumber=?, PackageNumber=? WHERE RecordNumber=?',
        [SeviceDate, PlateNumber, PackageNumber, recordNumber],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Service record updated successfully' });
        }
    );
});

// Delete service record
app.delete('/api/services/:recordNumber', (req, res) => {
    const { recordNumber } = req.params;
    
    db.query('DELETE FROM ServicePackage WHERE RecordNumber=?', [recordNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Service record deleted successfully' });
    });
});

// ============ PAYMENT ENDPOINTS ============

// Get all payments
app.get('/api/payments', (req, res) => {
    db.query(`
        SELECT p.*, sp.RecordNumber, c.PlateNumber, c.DriverName, pk.PackageName, pk.PackagePrice
        FROM Payment p
        JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
        ORDER BY p.PaymentDate DESC
    `, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create payment
app.post('/api/payments', (req, res) => {
    const { PaymentNumber, AmountPaid, PaymentDate, RecordNumber } = req.body;
    
    db.query(
        'INSERT INTO Payment (PaymentNumber, AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?, ?)',
        [PaymentNumber, AmountPaid, PaymentDate, RecordNumber],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Payment recorded successfully' });
        }
    );
});

// Get daily report
app.get('/api/reports/daily', (req, res) => {
    const { date } = req.query;
    
    db.query(`
        SELECT c.PlateNumber, pk.PackageName, pk.PackageDescription, 
               p.AmountPaid, p.PaymentDate
        FROM Payment p
        JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
        WHERE DATE(p.PaymentDate) = ?
        ORDER BY p.PaymentDate DESC
    `, [date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Generate bill for service
app.get('/api/bill/:recordNumber', (req, res) => {
    const { recordNumber } = req.params;
    
    db.query(`
        SELECT sp.RecordNumber, sp.SeviceDate, 
               c.PlateNumber, c.DriverName, c.CarType, c.CarSize,
               pk.PackageName, pk.PackageDescription, pk.PackagePrice,
               p.AmountPaid, p.PaymentDate
        FROM ServicePackage sp
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
        LEFT JOIN Payment p ON sp.RecordNumber = p.RecordNumber
        WHERE sp.RecordNumber = ?
    `, [recordNumber], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Service not found' });
        res.json(results[0]);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});