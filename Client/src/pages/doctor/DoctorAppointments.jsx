import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/doctor-appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/update-status',
        { appointmentsId: record._id, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        alert(res.data.message);
        getAppointments(); // Segarkan tabel
      }
    } catch (error) {
      console.log(error);
      alert('Terjadi kesalahan sistem');
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
            <div className="page-eyebrow">Dokter</div>
            <h3 className="page-title">Jadwal Pasien Saya</h3>
            <p className="page-subtitle">Tinjau antrean konsultasi pasien dan tanggapi permintaan yang masih menunggu persetujuan.</p>
          </div>
        </div>
      <div className="card surface-card p-3">
        {/* Tambahkan div pembungkus table-responsive di sini */}
        <div className="table-responsive">
          <table className="table table-hover" style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th>ID Pemesanan</th>
                <th>Nama Pasien</th>
                <th>No. HP Pasien</th> 
                <th>Tanggal & Waktu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={index}>
                  <td>{appt._id}</td>
                  <td>{appt.userInfo?.name || 'Data Hilang'}</td>
                  
                  {/* <-- Menampilkan No. HP Pasien --> */}
                  <td>{appt.userInfo?.phone || <span className="text-muted fst-italic">Belum diisi</span>}</td> 
                  
                  <td>{appt.date} | {appt.time}</td>
                  <td>
                    <span className={`badge ${appt.status === 'pending' ? 'bg-warning text-dark' : appt.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.status === 'pending' && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleStatus(appt, 'approved')}>Terima</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatus(appt, 'rejected')}>Tolak</button>
                      </div>
                    )}
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

export default DoctorAppointments;