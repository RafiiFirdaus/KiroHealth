import React from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';

const NotificationPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

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
        success(res.data.message);
        dispatch(setUser(res.data.data));
      } else {
        notifyError(res.data.message);
      }
    } catch (err) {
      console.log(err);
      notifyError('A system error occurred');
    }
  };

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Activity</div>
            <h3 className="page-title">Notifications</h3>
            <p className="page-subtitle">Check the latest updates for appointments, doctor approvals, and your account activity.</p>
          </div>
        </div>
      <div className="card surface-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Unread Notifications</h5>
          <h6 style={{ cursor: 'pointer', color: 'blue' }} onClick={handleMarkAllRead}>
            Mark All as Read
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
          <p className="text-center text-muted">No new notifications.</p>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;