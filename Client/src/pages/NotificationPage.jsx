import React from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fungsi untuk menandai semua notifikasi telah dibaca
  const handleMarkAllRead = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/get-all-notification',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (res.data.success) {
        alert(res.data.message);
        // Perbarui data user di brankas Redux agar badge lonceng hilang
        dispatch(setUser(res.data.data)); 
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
            <div className="page-eyebrow">Aktivitas</div>
            <h3 className="page-title">Halaman Notifikasi</h3>
            <p className="page-subtitle">Cek pembaruan terbaru terkait janji temu, persetujuan dokter, dan aktivitas akun Anda.</p>
          </div>
        </div>
      <div className="card surface-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Notifikasi Belum Dibaca</h5>
          <h6 style={{ cursor: 'pointer', color: 'blue' }} onClick={handleMarkAllRead}>
            Tandai Semua Dibaca
          </h6>
        </div>

        {user?.notification?.length > 0 ? (
          user.notification.map((notif, index) => (
            <div 
              key={index} 
              className="alert alert-secondary" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(notif.data.onClickPath)}
            >
              {notif.message}
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Tidak ada notifikasi baru.</p>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;