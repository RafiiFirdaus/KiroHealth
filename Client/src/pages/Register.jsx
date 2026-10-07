import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import brandLogo from '../assets/kirohealth_logo.png';
import { useNotification } from '../components/NotificationProvider';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      if (res.data.success) {
        success(res.data.message);
        navigate('/login');
      } else {
        notifyError(res.data.message);
      }
    } catch (err) {
      console.log(err);
      notifyError('An error occurred on the server');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-simple card surface-card">
        <div className="auth-simple-logo-wrap">
          <img src={brandLogo} alt="KiroHealth" className="auth-simple-logo" />
        </div>

        <div className="auth-simple-header">
          <p className="page-eyebrow mb-1">Create account</p>
          <h2>Register for KiroHealth</h2>
          <p>Create a new account to start using KiroHealth services.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Enter your name" required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter your password" required />
          </div>
          <div className="mb-3">
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="Enter your phone number" required />
          </div>
          <button className="btn btn-primary w-100 mb-3" type="submit">Register</button>
          <div className="text-center text-muted">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
        </div>
    </div>
  );
};

export default Register;