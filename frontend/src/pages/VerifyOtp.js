
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // email passed from Signup (navigate('/verify-otp', {state:{email}}))
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    try {
      const res = await authAPI.verifyOtp({ email, otp });

      /**
       * Your backend should return something like:
       * { message: 'Verified', token: 'jwt...', user: {...} }
       */
      const { message: backendMsg, token, user } = res.data;

      // Save token + user in AuthContext/localStorage:
      if (token && user) login(user, token);

      setMessage(backendMsg || 'OTP verified successfully');
      // after 2 seconds go to dashboard (or login if you prefer)
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />
        </div>

        <button type="submit" className="auth-button">Verify OTP</button>

        <p className="auth-info">
          We’ve sent a 6-digit verification code to {email}
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
