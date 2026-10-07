import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useNotification } from '../../components/NotificationProvider';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const { success, error: notifyError } = useNotification();

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
        success(res.data.message);
        getDoctors(); 
        setSelectedDoc(null);
      }
    } catch (err) {
      console.log(err);
      notifyError('A system error occurred');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Layout>
      <div className="page-stack">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Admin</div>
            <h3 className="page-title">Manage Doctors</h3>
            <p className="page-subtitle">Review new doctor registrations, view details, and change approval status quickly.</p>
          </div>
        </div>
      
      {selectedDoc && (
        <div className="card surface-card mb-4 border-info">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Applicant Details: Dr. {selectedDoc.fullname}</h5>
            <button className="btn btn-sm btn-light" onClick={() => setSelectedDoc(null)}>Close</button>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-2"><small className="text-muted">Professional Email:</small><br/><b>{selectedDoc.email}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Phone / WhatsApp:</small><br/><b>{selectedDoc.phone}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Specialization:</small><br/><b>{selectedDoc.specialization}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Experience:</small><br/><b>{selectedDoc.experience} years</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Consultation Fee:</small><br/><b>Rp {selectedDoc.fees}</b></div>
              <div className="col-md-4 mb-2"><small className="text-muted">Working Hours:</small><br/><b>{selectedDoc.timings[0]} - {selectedDoc.timings[1]}</b></div>
              <div className="col-md-12"><small className="text-muted">Practice Address:</small><br/><b>{selectedDoc.address}</b></div>
            </div>
          </div>
        </div>
      )}

      <div className="card surface-card p-3">
        <div className="table-responsive">
          <table className="table table-hover" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Action</th>
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
                      {doctor.status === 'pending' ? 'Pending' : doctor.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-info btn-sm text-white" onClick={() => setSelectedDoc(doctor)}>Details</button>

                      {doctor.status === 'pending' ? (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleAccountStatus(doctor, 'approved')}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAccountStatus(doctor, 'rejected')}>Reject</button>
                        </>
                      ) : doctor.status === 'approved' ? (
                        <button className="btn btn-danger btn-sm" onClick={() => handleAccountStatus(doctor, 'rejected')}>Revoke</button>
                      ) : (
                        <button className="btn btn-secondary btn-sm" disabled>Rejected</button>
                      )}
                    </div>
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

export default Doctors;