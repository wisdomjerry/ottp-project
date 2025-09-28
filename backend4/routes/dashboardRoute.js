// dashboardRoute.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database'); // your DB connection
const authMiddleware = require('../middleware/authMiddleware'); // middleware to verify JWT

// GET Dashboard Data
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        // Example query: fetch user-specific dashboard info
        const query = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
        
        db.query(query, [userId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });
            
            res.json({
                message: 'Dashboard data fetched successfully',
                data: results[0]
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
