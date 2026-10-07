import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null); // State untuk menampung data detail dokter

  const getDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getAllDoctors', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/changeAccountStatus',
        { doctorId: record._id, status: status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        alert(res.data.message);
        getDoctors(); 
        setSelectedDoc(null); // Tutup panel detail setelah update status
      }
    } catch (error) {
      console.log(error);
      alert('Terjadi kesalahan sistem');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Layout>
      <h3 className="mb-4">Kelola Dokter</h3>
      
      {/* --- PANEL DETAIL DOKTER MUNCUL DI SINI JIKA TOMBOL DETAIL DIKLIK --- */}
      {selectedDoc && (
        <div className="card shadow-sm mb-4 border-info">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Detail Pendaftar: Dr. {selectedDoc.fullname}</h5>
            <button className="btn btn-sm btn-light" onClick={() => setSelectedDoc(null)}>Tutup</button>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-2"><small className="text-muted">Email Profesional:</small><br/><b>{selectedDoc.email}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">No. Telepon / WhatsApp:</small><br/><b>{selectedDoc.phone}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Spesialisasi:</small><br/><b>{selectedDoc.specialization}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Pengalaman:</small><br/><b>{selectedDoc.experience} Tahun</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Biaya Konsultasi:</small><br/><b>Rp {selectedDoc.fees}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Jam Praktik:</small><br/><b>{selectedDoc.timings[0]} - {selectedDoc.timings[1]}</b></div>
              <div className="col-md-12"><small className="text-muted">Alamat Praktik:</small><br/><b>{selectedDoc.address}</b></div>
            </div>
          </div>
        </div>
      )}

      {/* --- TABEL UTAMA --- */}
      <div className="card shadow-sm p-3">
        <div className="table-responsive">
          <table className="table table-hover" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Spesialisasi</th>
                <th>Pengalaman</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={index}>
                  <td>{doctor.fullname}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience} Tahun</td>
                  <td>
                    <span className={`badge ${doctor.status === 'pending' ? 'bg-warning text-dark' : doctor.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* Tombol Detail Baru */}
                      <button className="btn btn-info btn-sm text-white" onClick={() => setSelectedDoc(doctor)}>Detail</button>
                      
                      {/* Logika Tombol Persetujuan */}
                      {doctor.status === 'pending' ? (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleAccountStatus(doctor, 'approved')}>Setujui</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAccountStatus(doctor, 'rejected')}>Tolak</button>
                        </>
                      ) : doctor.status === 'approved' ? (
                        <button className="btn btn-danger btn-sm" onClick={() => handleAccountStatus(doctor, 'rejected')}>Cabut Izin</button>
                      ) : (
                        <button className="btn btn-secondary btn-sm" disabled>Ditolak</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;