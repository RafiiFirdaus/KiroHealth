import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  // Menangkap ketikan pengguna
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mengirim data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      if (res.data.success) {
        alert(res.data.message);
        navigate('/login'); // Lempar ke halaman login jika sukses
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
        <h3 className="text-center mb-4">Daftar KiroHealth</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Masukkan nama" required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Masukkan email" required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Masukkan password" required />
          </div>
          <div className="mb-3">
            <label>No. HP</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="Masukkan no hp" required />
          </div>
          <button className="btn btn-primary w-100 mb-3" type="submit">Daftar</button>
          <div className="text-center">
            Sudah punya akun? <Link to="/login">Login di sini</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;