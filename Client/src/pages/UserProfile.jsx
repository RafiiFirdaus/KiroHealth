import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';
import { useNotification } from '../components/NotificationProvider';

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { success, error: notifyError } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (res.data.success) {
        success(res.data.message);
        dispatch(setUser(res.data.data));
      }
    } catch (err) {
      console.log(err);
      notifyError('An error occurred while updating the profile');
    }
  };

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Account</div>
            <h3 className="page-title">My Profile</h3>
            <p className="page-subtitle">Update your account details so information stays consistent across the app.</p>
          </div>
        </div>
      <div className="card surface-card p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div 
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '80px', height: '80px', fontSize: '2rem' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h5 className="mb-0">{user?.type === 'admin' ? 'Administrator' : 'Patient'}</h5>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="fw-bold">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="form-control" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="fw-bold">Phone / WhatsApp Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Example: 08123456789"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Save Changes</button>
        </form>
      </div>
      </div>
    </Layout>
  );
};

export default UserProfile;