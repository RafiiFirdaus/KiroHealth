import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import brandLogo from '../assets/kirohealth_logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      if (res.data.success) {
        alert(res.data.message);
        localStorage.setItem('token', res.data.token); // Simpan token sebagai tiket masuk
        navigate('/'); // Lempar ke dasbor utama
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert('Terjadi kesalahan pada server');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-simple card surface-card">
        <div className="auth-simple-logo-wrap">
          <img src={brandLogo} alt="KiroHealth" className="auth-simple-logo"/>
        </div>

        <div className="auth-simple-header">
          <p className="page-eyebrow mb-1">Selamat datang</p>
          <h2>Login KiroHealth</h2>
          <p>Masuk untuk melanjutkan ke dashboard layanan kesehatan Anda.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Masukkan email" required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Masukkan password" required />
          </div>
          <button className="btn btn-primary w-100 mb-3" type="submit">Login</button>
          <div className="text-center text-muted">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </div>
        </form>
        </div>
    </div>
  );
};

export default Login;