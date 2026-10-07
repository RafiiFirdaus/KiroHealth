import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const params = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  // State baru untuk melacak ketersediaan
  const [isAvailable, setIsAvailable] = useState(false);

  const getDoctorData = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/getDoctorById',
        { doctorId: params.doctorId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Fungsi mengecek ketersediaan ke backend
  const handleCheckAvailability = async () => {
    if (!date || !time) {
      return alert("Harap lengkapi tanggal dan waktu terlebih dahulu");
    }

    // 1. Validasi Tanggal (Mencegah input masa lalu jika diketik manual)
    if (date < today) {
      return alert("Tanggal pemesanan tidak boleh berlalu (harus hari ini atau ke depannya).");
    }

    // 2. Validasi Jam Praktik
    const startTime = doctor.timings[0];
    const endTime = doctor.timings[1];
    if (time < startTime || time > endTime) {
      return alert(`Jam tidak valid! Silakan pilih waktu antara jam praktik dokter: ${startTime} - ${endTime}`);
    }

    // 3. Lanjut ke API cek ketersediaan jika validasi sukses
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/check-booking-availability',
        { doctorId: params.doctorId, date: date, time: time },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        setIsAvailable(true);
        alert(res.data.message);
      } else {
        setIsAvailable(false);
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert('Terjadi kesalahan saat mengecek jadwal');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/book-appointment',
        { doctorId: params.doctorId, date: date, time: time },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        alert(res.data.message);
        navigate('/appointments'); // Lempar ke halaman riwayat agar pasien bisa melihat statusnya
      }
    } catch (error) {
      console.log(error);
      alert('Terjadi kesalahan saat memproses janji temu');
    }
  };

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Janji Temu</div>
            <h3 className="page-title">Buat Janji Temu</h3>
            <p className="page-subtitle">Pilih tanggal dan waktu konsultasi yang sesuai dengan jadwal praktik dokter.</p>
          </div>
        </div>
      <div className="container px-0">
        {doctor ? (
          <div className="card surface-card p-4 mx-auto" style={{ maxWidth: '600px' }}>
            <h4 className="text-primary mb-3">Dr. {doctor.fullname}</h4>
            <p><b>Spesialisasi:</b> {doctor.specialization}</p>
            <p><b>Biaya Konsultasi:</b> Rp {doctor.fees}</p>
            <p><b>Jam Praktik:</b> {doctor.timings[0]} - {doctor.timings[1]}</p>
            
            <hr />
            
            <form onSubmit={handleBooking}>
              <div className="mb-3">
                <label className="fw-bold">Pilih Tanggal</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={date} 
                  min={today} // <-- Tambahkan atribut min di sini
                  onChange={(e) => { setDate(e.target.value); setIsAvailable(false); }} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="fw-bold">Pilih Waktu</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={time} 
                  // Reset state isAvailable menjadi false jika waktu diubah
                  onChange={(e) => { setTime(e.target.value); setIsAvailable(false); }} 
                  required 
                />
              </div>

              {/* Tampilkan tombol berbeda berdasarkan status isAvailable */}
              {!isAvailable ? (
                <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCheckAvailability}>
                  Cek Ketersediaan
                </button>
              ) : (
                <button type="submit" className="btn btn-primary w-100 mt-2">
                  Kirim Permintaan
                </button>
              )}
            </form>
          </div>
        ) : (
          <p>Memuat data dokter...</p>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;