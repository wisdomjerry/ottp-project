const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Middleware to protect routes and attach user to req
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization') || req.headers['authorization'];
  const token = authHeader?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Support tokens that may include `userId` or `id` claim
    const idToUse = decoded.userId || decoded.id;

    // Fetch user from DB
    db.query('SELECT id, name, email, role FROM users WHERE id = ?', [idToUse], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) return res.status(401).json({ message: 'Token not valid' });

      // attach user to request (ensure role and id present)
      // Provide both `id` and `userId` to be compatible with existing server usage
      req.user = {
        id: results[0].id,
        userId: results[0].id,
        name: results[0].name,
        email: results[0].email,
        role: results[0].role
      };
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: 'Token not valid' });
  }
};

// Middleware for admin-only routes
const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'User not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
};

module.exports = { authMiddleware, adminOnly };


