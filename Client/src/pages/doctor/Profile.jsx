import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNotification } from '../../components/NotificationProvider';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState({
    fullname: '', email: '', phone: '', address: '',
    specialization: '', experience: '', fees: '',
    timingStart: '', timingEnd: ''
  });

  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/getDoctorInfo',
        { userId: params.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        const doctor = res.data.data;
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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        success(res.data.message);
        navigate('/');
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
            <div className="page-eyebrow">Doctor</div>
            <h3 className="page-title">Manage Doctor Profile</h3>
            <p className="page-subtitle">Update your practice identity, working hours, and consultation fee quickly.</p>
          </div>
        </div>
      {formData && (
        <form onSubmit={handleUpdate} className="card surface-card p-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Full Name</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Professional Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Phone / WhatsApp Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-12 mb-3">
              <label>Practice Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Specialization</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Experience (Years)</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-4 mb-3">
              <label>Consultation Fee (Rp)</label>
              <input type="number" name="fees" value={formData.fees} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Practice Start Time</label>
              <input type="time" name="timingStart" value={formData.timingStart} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Practice End Time</label>
              <input type="time" name="timingEnd" value={formData.timingEnd} onChange={handleChange} className="form-control" required />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button type="submit" className="btn btn-primary px-4">Save Changes</button>
          </div>
        </form>
      )}
      </div>
    </Layout>
  );
};

export default Profile;