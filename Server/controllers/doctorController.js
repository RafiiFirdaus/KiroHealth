const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');

// Fetch appointment schedules for this doctor
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({ doctorInfo: doctor._id }).populate('userInfo');
        res.status(200).send({ success: true, message: 'Schedule retrieved successfully', data: appointments });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to fetch schedule', error });
    }
};

// Update appointment status (Accept/Reject)
const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, { status });
        
        // Send a notification to the patient
        const user = await userModel.findOne({ _id: appointments.userInfo });
        user.notification.push({
            type: 'status-updated',
            message: `Your appointment request has been ${status === 'approved' ? 'approved' : 'rejected'}`,
            onClickPath: '/appointments'
        });
        await user.save();
        
        res.status(200).send({ success: true, message: 'Appointment status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to update status', error });
    }
};

// Fetch doctor profile data for the form
const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'Profile data retrieved successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to fetch profile data', error });
    }
};

// Save doctor profile changes
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.body.userId },
            req.body,
            { new: true } // Return the latest data after update
        );
        res.status(200).send({
            success: true,
            message: 'Doctor profile updated successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to update profile', error });
    }
};

module.exports = { doctorAppointmentsController, 
    updateStatusController, 
    getDoctorInfoController, 
    updateProfileController };