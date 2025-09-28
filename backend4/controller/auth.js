const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { generateOtp, sendOtpEmail } = require('../utils/otp');

// Signup controller
const signup = async (req, res) => {
  let { name, email, password, role } = req.body;
  email = email.trim();
  role = role || 'user'; // default role is 'user'

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    db.query(
      'INSERT INTO users (name, email, password, otp, otp_expiry, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, otp, otpExpiry, role],
      (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        sendOtpEmail(email, otp);

        res.status(201).json({
          message: 'User registered. Check your email for OTP verification.',
        });
      }
    );
  });
};

// Verify OTP
const verifyOtp = (req, res) => {
  let { email, otp } = req.body;
  email = email.trim();
  otp = otp.toString().trim();

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const dbOtp = user.otp ? user.otp.toString().trim() : '';

    if (dbOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (!user.otp_expiry || new Date() > new Date(user.otp_expiry))
      return res.status(400).json({ message: 'OTP expired' });

    // OTP verified → mark user as verified
    db.query(
      'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE email = ?',
      [email],
      (err) => {
        if (err) return res.status(500).json({ message: 'Database update error' });

        // Generate JWT including role (use `userId` claim for consistency)
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role, name: user.name },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '1h' }
        );

        res.json({
          message: 'OTP verified successfully',
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
      }
    );
  });
};

// Login controller (send OTP)
const login = (req, res) => {
  let { email } = req.body;
  email = email.trim();

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    if (!user.is_verified) return res.status(400).json({ message: 'Please verify your account first' });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?', [otp, otpExpiry, email], (err) => {
      if (err) return res.status(500).json({ message: 'Database update error' });

      sendOtpEmail(email, otp);
      res.json({ message: 'Login OTP sent to your email' });
    });
  });
};

// Dashboard controller
const dashboard = (req, res) => {
  if (req.user.role === 'admin') {
    // Admin sees all users
    db.query('SELECT id, name, email, role, created_at FROM users', (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Admin dashboard', users: results });
    });
  } else {
    // User sees only their info
    db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'User dashboard', user: results[0] });
    });
  }
};

const getProfile = (req, res) => { // Get the profile of the signed-in user
  db.getUserById(req.user.id, (err, user) => {
    if (err || !user) { return res.status(404).json({ success: false, message: 'User not found' }); } // If error or user not found, send 404
    res.json({ // Return user profile info
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        bio: user.bio,
        profile_picture: user.profile_picture ? `/uploads/profiles/${path.basename(user.profile_picture)}` : null, // If user has a profile picture, return its URL
        last_seen: user.last_seen,
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    });
  });
};

module.exports = { signup, verifyOtp, login, dashboard,getProfile };

