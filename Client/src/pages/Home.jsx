import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const getUserData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/getAllDoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (user && user.type === 'admin') {
    return (
      <Layout>
        <div className="page-stack">
          <div className="page-header">
            <div>
              <div className="page-eyebrow">Dasbor Admin</div>
              <h3 className="page-title">Dasbor Administrator</h3>
              <p className="page-subtitle">Pusat kendali KiroHealth untuk memantau pendaftaran dokter, pengguna, dan aktivitas layanan.</p>
            </div>
          </div>
          <div className="alert alert-info">
            <h4 className="alert-heading">Selamat datang, Admin!</h4>
            <p>Anda berada di pusat kendali aplikasi KiroHealth. Silakan gunakan menu di sebelah kiri untuk memvalidasi pendaftaran dokter baru atau mengelola pengguna yang ada.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (user && user.isdoctor) {
    return (
      <Layout>
        <div className="page-stack">
          <div className="page-header">
            <div>
              <div className="page-eyebrow">Dasbor Dokter</div>
              <h3 className="page-title">Dasbor Dokter</h3>
              <p className="page-subtitle">Kelola jadwal pasien, respons janji temu, dan data praktik dalam satu ruang kerja yang lebih tenang.</p>
            </div>
          </div>
          <div className="alert alert-success">
            <h4 className="alert-heading">Selamat datang, Dr. {user.name}!</h4>
            <p>Silakan gunakan menu "Jadwal Pasien" untuk melihat dan merespons permintaan janji temu, atau menu "Profil" untuk memperbarui data praktik Anda.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Temukan Dokter</div>
            <h3 className="page-title">Daftar Dokter Tersedia</h3>
            <p className="page-subtitle">Pilih dokter yang sesuai kebutuhan Anda dan lanjutkan ke jadwal konsultasi yang tersedia.</p>
          </div>
        </div>
        <div className="row g-4">
        {doctors && doctors
          .filter(doctor => doctor.userId !== user?._id) // Filter akun sendiri
          .map((doctor, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card surface-card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{doctor.fullname}</h5>
              </div>
              <div className="card-body">
                <p className="mb-1"><b>Spesialisasi:</b> {doctor.specialization}</p>
                <p className="mb-1"><b>Pengalaman:</b> {doctor.experience} Tahun</p>
                <p className="mb-1"><b>Biaya:</b> Rp {doctor.fees}</p>
                <p className="mb-3"><b>Jam Praktik:</b> {doctor.timings[0]} - {doctor.timings[1]}</p>
                
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                >
                  Buat Janji Temu
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;