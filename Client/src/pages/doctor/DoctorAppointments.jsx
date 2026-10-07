import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useNotification } from '../../components/NotificationProvider';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { success, error: notifyError } = useNotification();

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
        success(res.data.message);
        getAppointments();
      }
    } catch (err) {
      console.log(err);
      notifyError('A system error occurred');
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
            <div className="page-eyebrow">Doctor</div>
            <h3 className="page-title">My Patient Schedule</h3>
            <p className="page-subtitle">Review the patient consultation queue and respond to requests that are still pending approval.</p>
          </div>
        </div>
      <div className="card surface-card p-3">
        <div className="table-responsive">
          <table className="table table-hover" style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Name</th>
                <th>Patient Phone</th> 
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={index}>
                  <td>{appt._id}</td>
                  <td>{appt.userInfo?.name || 'Missing data'}</td>
                  
                  <td>{appt.userInfo?.phone || <span className="text-muted fst-italic">Not provided</span>}</td> 
                  
                  <td>{appt.date} | {appt.time}</td>
                  <td>
                    <span className={`badge ${appt.status === 'pending' ? 'bg-warning text-dark' : appt.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                      {appt.status === 'pending' ? 'Pending' : appt.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </td>
                  <td>
                    {appt.status === 'pending' && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleStatus(appt, 'approved')}>Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatus(appt, 'rejected')}>Reject</button>
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