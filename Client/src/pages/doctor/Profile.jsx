import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '', email: '', phone: '', address: '',
    specialization: '', experience: '', fees: '',
    timingStart: '', timingEnd: ''
  });

  // Memanggil data profil dokter
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/getDoctorInfo',
        { userId: params.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        const doctor = res.data.data;
        // Mengisi form dengan data dari database
        setFormData({
          fullname: doctor.fullname,
          email: doctor.email,
          phone: doctor.phone,
          address: doctor.address,
          specialization: doctor.specialization,
          experience: doctor.experience,
          fees: doctor.fees,
          timingStart: doctor.timings[0],
          timingEnd: doctor.timings[1]
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mengirim data pembaruan
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/updateProfile',
        { 
          ...formData, 
          userId: user._id, 
          timings: [formData.timingStart, formData.timingEnd] 
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        alert(res.data.message);
        navigate('/'); // Lempar ke beranda setelah sukses
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert('Terjadi kesalahan sistem');
    }
  };

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Dokter</div>
            <h3 className="page-title">Kelola Profil Dokter</h3>
            <p className="page-subtitle">Perbarui identitas praktik, jam kerja, dan tarif konsultasi Anda dengan cepat.</p>
          </div>
        </div>
      {formData && (
        <form onSubmit={handleUpdate} className="card surface-card p-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Nama Lengkap</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Email Profesional</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>No. Telepon / WhatsApp</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-12 mb-3">
              <label>Alamat Praktik</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Spesialisasi</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Pengalaman (Tahun)</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Biaya Konsultasi (Rp)</label>
              <input type="number" name="fees" value={formData.fees} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Jam Mulai Praktik</label>
              <input type="time" name="timingStart" value={formData.timingStart} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Jam Selesai Praktik</label>
              <input type="time" name="timingEnd" value={formData.timingEnd} onChange={handleChange} className="form-control" required />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button type="submit" className="btn btn-primary px-4">Simpan Perubahan</button>
          </div>
        </form>
      )}
      </div>
    </Layout>
  );
};

export default Profile;