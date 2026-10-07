import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/user-appointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Riwayat</div>
            <h3 className="page-title">Riwayat Janji Temu</h3>
            <p className="page-subtitle">Pantau semua permintaan konsultasi, status persetujuan, dan jadwal yang sudah Anda buat.</p>
          </div>
        </div>
        <div className="card surface-card p-3">
        {/* Tambahkan div table-responsive di sini */}
        <div className="table-responsive">
          <table className="table table-hover" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>ID Pemesanan</th>
                <th>Nama Dokter</th> {/* Tambahan kolom baru */}
                <th>Tanggal & Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={index}>
                  <td>{appt._id}</td>
                  {/* Menampilkan nama dokter hasil dari populate */}
                  <td>{appt.doctorInfo?.fullname || 'Data Dokter Tidak Ditemukan'}</td>
                  <td>{appt.date} | {appt.time}</td>
                  <td>
                    <span className={`badge ${appt.status === 'pending' ? 'bg-warning text-dark' : appt.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;