import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = "http://localhost:5000/api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/verify-otp`, { email, otp });
      const token = res.data.token;
      const userData = res.data.user; // includes role

      // Save in context + localStorage
      login(userData, token);

      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        // Redirect based on role
        if (userData.role === 'admin') navigate('/admin-dashboard');
        else navigate('/dashboard'); // user dashboard
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={step === 1 ? handleEmailSubmit : handleOtpSubmit}>
        <h2>Login</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>
        )}

        <button type="submit" className="auth-button">
          {step === 1 ? 'Send OTP' : 'Verify & Login'}
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

