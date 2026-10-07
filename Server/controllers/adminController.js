const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');

// Fetch all user data
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({ success: true, message: 'User data retrieved successfully', data: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to fetch user data', error });
    }
};

// Fetch all doctor data
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({ success: true, message: 'Doctor data retrieved successfully', data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to fetch doctor data', error });
    }
};

// Update doctor approval status
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });
        
        // Find the user account linked to this doctor so they can be notified
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your doctor account application has been ${status === 'approved' ? 'approved' : 'rejected'}`,
            onClickPath: '/notification'
        });
        
        // If approved, set isdoctor to true
        user.isdoctor = status === 'approved' ? true : false;
        await user.save();

        res.status(201).send({ success: true, message: 'Doctor account status updated successfully', data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Failed to update account status', error });
    }
};

module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController };