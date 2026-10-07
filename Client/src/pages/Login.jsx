import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Login KiroHealth</h3>
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
          <div className="text-center">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;