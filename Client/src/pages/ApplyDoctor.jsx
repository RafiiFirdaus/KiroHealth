import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNotification } from '../components/NotificationProvider';

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    timingStart: '',
    timingEnd: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        userId: user._id,
        timings: [formData.timingStart, formData.timingEnd]
      };

      const res = await axios.post(
        'http://localhost:5000/api/users/apply-doctor',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
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
            <div className="page-eyebrow">Doctor Registration</div>
            <h3 className="page-title">Doctor Application Form</h3>
            <p className="page-subtitle">Fill in your personal and practice details to request verification as a doctor on KiroHealth.</p>
          </div>
        </div>
      <form onSubmit={handleSubmit} className="card surface-card p-4">
        <h5 className="mb-3 text-primary">Personal & Professional Information</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Full Name (including title)</label>
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
            <label>Practice / Clinic Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="form-control" placeholder="Example: Dentist" required />
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
          <button type="submit" className="btn btn-primary px-4">Submit Application</button>
        </div>
      </form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;