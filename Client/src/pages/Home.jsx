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
              <div className="page-eyebrow">Admin Dashboard</div>
              <h3 className="page-title">Administrator Dashboard</h3>
              <p className="page-subtitle">KiroHealth control center for monitoring doctor registrations, users, and service activity.</p>
            </div>
          </div>
          <div className="alert alert-info">
            <h4 className="alert-heading">Welcome, Admin!</h4>
            <p>You are in the KiroHealth control center. Use the left menu to review new doctor registrations or manage existing users.</p>
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
                <div className="page-eyebrow">Doctor Dashboard</div>
                <h3 className="page-title">Doctor Dashboard</h3>
                <p className="page-subtitle">Manage patient schedules, appointment responses, and practice details in one calmer workspace.</p>
            </div>
          </div>
          <div className="alert alert-success">
              <h4 className="alert-heading">Welcome, Dr. {user.name}!</h4>
              <p>Use the "Patient Schedule" menu to review appointment requests, or "Profile" to update your practice details.</p>
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
            <div className="page-eyebrow">Find a Doctor</div>
            <h3 className="page-title">Available Doctors</h3>
            <p className="page-subtitle">Choose the doctor that fits your needs and continue to the available consultation schedule.</p>
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
                <p className="mb-1"><b>Specialization:</b> {doctor.specialization}</p>
                <p className="mb-1"><b>Experience:</b> {doctor.experience} years</p>
                <p className="mb-1"><b>Fee:</b> Rp {doctor.fees}</p>
                <p className="mb-3"><b>Working Hours:</b> {doctor.timings[0]} - {doctor.timings[1]}</p>
                
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                >
                  Book Appointment
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