import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationProvider';

const BookAppointment = () => {
  const params = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { success, error: notifyError } = useNotification();
  
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

  const today = new Date().toISOString().split('T')[0];

  const handleCheckAvailability = async () => {
    if (!date || !time) {
      notifyError('Please fill in the date and time first');
      return;
    }

    if (date < today) {
      notifyError('The booking date cannot be in the past. Please choose today or a future date.');
      return;
    }

    const startTime = doctor.timings[0];
    const endTime = doctor.timings[1];
    if (time < startTime || time > endTime) {
      notifyError(`Invalid time! Please choose a time within the doctor's working hours: ${startTime} - ${endTime}`);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/check-booking-availability',
        { doctorId: params.doctorId, date: date, time: time },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        setIsAvailable(true);
        success(res.data.message);
      } else {
        setIsAvailable(false);
        notifyError(res.data.message);
      }
    } catch (err) {
      console.log(err);
      notifyError('An error occurred while checking availability');
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
        success(res.data.message);
        navigate('/appointments');
      }
    } catch (err) {
      console.log(err);
      notifyError('An error occurred while processing the appointment');
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
            <div className="page-eyebrow">Appointment</div>
            <h3 className="page-title">Book an Appointment</h3>
            <p className="page-subtitle">Choose a consultation date and time that fits the doctor's working schedule.</p>
          </div>
        </div>
      <div className="container px-0">
        {doctor ? (
          <div className="card surface-card p-4 mx-auto" style={{ maxWidth: '600px' }}>
            <h4 className="text-primary mb-3">Dr. {doctor.fullname}</h4>
            <p><b>Specialization:</b> {doctor.specialization}</p>
            <p><b>Consultation Fee:</b> Rp {doctor.fees}</p>
            <p><b>Working Hours:</b> {doctor.timings[0]} - {doctor.timings[1]}</p>
            
            <hr />
            
            <form onSubmit={handleBooking}>
              <div className="mb-3">
                <label className="fw-bold">Choose Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={date} 
                  min={today}
                  onChange={(e) => { setDate(e.target.value); setIsAvailable(false); }} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="fw-bold">Choose Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={time} 
                  onChange={(e) => { setTime(e.target.value); setIsAvailable(false); }} 
                  required 
                />
              </div>

              {!isAvailable ? (
                <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCheckAvailability}>
                  Check Availability
                </button>
              ) : (
                <button type="submit" className="btn btn-primary w-100 mt-2">
                  Submit Request
                </button>
              )}
            </form>
          </div>
        ) : (
          <p>Loading doctor data...</p>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;