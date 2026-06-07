import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const API_URL = 'http://localhost:5000';

const AuthPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Register
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [registerData, setRegisterData] = useState({ name: '', rollNumber: '', department: '', year: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your college email");
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        setSuccessMsg("OTP sent to your email!");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server error. Ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return setError("Please enter a 6-digit OTP");
    
    setError('');
    setLoading(true);
    setSuccessMsg('');
    
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.isRegistered) {
          login(data.token);
          navigate('/');
        } else {
          setStep(3);
          setSuccessMsg("OTP verified. Please complete your registration.");
        }
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.rollNumber) {
      return setError("Name and Roll Number are required");
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp: otp.join(''), 
          ...registerData 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    
    if (val !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="glass-container fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'white' }}>FacePass</h2>
      <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>
        {step === 1 ? 'Enter your college email to login' : step === 2 ? 'Verify your identity' : 'Complete your profile'}
      </p>

      {error && <div className="error-text">{error}</div>}
      {successMsg && <div className="success-text">{successMsg}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="fade-in">
          <div className="input-group">
            <label className="input-label">College Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="e.g. john@iitp.ac.in" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="fade-in">
          <div className="otp-container">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                className="otp-input"
                value={digit}
                onChange={(e) => handleOtpChange(e, i)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
              />
            ))}
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleRegister} className="fade-in">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="John Doe" 
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Roll Number</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. 2101CS45" 
              value={registerData.rollNumber}
              onChange={(e) => setRegisterData({...registerData, rollNumber: e.target.value})}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Department</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="CSE" 
                value={registerData.department}
                onChange={(e) => setRegisterData({...registerData, department: e.target.value})}
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Year</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="3" 
                value={registerData.year}
                onChange={(e) => setRegisterData({...registerData, year: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
