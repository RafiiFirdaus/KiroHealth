const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registration controller
const registerController = async (req, res) => {
    try {
        // Check whether the email already exists in the database
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: 'Email is already registered', success: false });
        }

        // Hash the password using bcrypt
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        // Save the new user
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: 'Registration successful', success: true });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Error Register Controller: ${error.message}` });
    }
};

// Login controller
const loginController = async (req, res) => {
    try {
        // Check whether the user exists in the database
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid email or password', success: false });
        }

        // Generate JWT token (valid for 1 day)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'Login successful', success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error Login Controller: ${error.message}`, success: false });
    }
};

// Controller for fetching the currently logged-in user
const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        } else {
            // Hide the password before sending the response
            user.password = undefined; 
            res.status(200).send({
                success: true,
                data: user
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error Auth Controller', success: false, error });
    }
};

const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
        await newDoctor.save();
        
        // --- NEW NOTIFICATION LOGIC ---
        // Find the user with the admin role
        const adminUser = await userModel.findOne({ type: 'admin' });
        
        if (adminUser) {
            const notification = adminUser.notification;
            notification.push({
                type: 'apply-doctor-request',
                message: `${newDoctor.fullname} has applied to become a doctor.`,
                data: {
                    doctorId: newDoctor._id,
                    name: newDoctor.fullname,
                    onClickPath: '/admin/doctors'
                }
            });
            // Update the admin data with the new notification
            await userModel.findByIdAndUpdate(adminUser._id, { notification });
        }
        // ------------------------------
        
        res.status(201).send({
            success: true,
            message: 'Doctor account application submitted and awaiting admin approval',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Error while processing doctor application' });
    }
};

// Controller for marking all notifications as read
const markAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const unreadNotifications = user.notification;
        
        // Move unread notifications to a seen_notification array if we want to preserve them
        // For now, clear the active notifications to keep it simple
        user.notification = []; 
        
        const updatedUser = await user.save();
        updatedUser.password = undefined; // Hide the password

        res.status(200).send({
            success: true,
            message: 'All notifications have been marked as read',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error while reading notifications', success: false, error });
    }
};

// Fetch all doctors with approved status
const getAllApprovedDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: 'Doctor list retrieved successfully',
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while fetching doctor data',
        });
    }
};

// Fetch a single doctor by ID
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({ success: true, message: 'Doctor data retrieved successfully', data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Failed to fetch doctor data' });
    }
};

// Save the appointment request and send a notification to the doctor
const bookAppointmentController = async (req, res) => {
    try {
        // Save the appointment data to the database
        const newAppointment = new appointmentModel({
            userInfo: req.body.userId, // Patient ID (from middleware)
            doctorInfo: req.body.doctorId, // Doctor ID (from frontend)
            date: req.body.date,
            time: req.body.time,
            status: 'pending'
        });
        await newAppointment.save();

        // Find the doctor's main account to send the notification
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        const user = await userModel.findOne({ _id: doctor.userId });
        
        user.notification.push({
            type: 'New-appointment-request',
            message: `There is a new appointment request on ${req.body.date} at ${req.body.time}`,
            onClickPath: '/doctor/appointments'
        });
        await user.save();

        res.status(200).send({ success: true, message: 'Appointment request submitted successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Failed to create appointment' });
    }
};

// Fetch appointments for the currently logged-in user (patient)
const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userInfo: req.body.userId }).populate('doctorInfo');
        res.status(200).send({
            success: true,
            message: 'Appointment history retrieved successfully',
            data: appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Failed to fetch appointment history'
        });
    }
};

// Update the user profile (Patient/Admin)
const updateUserProfileController = async (req, res) => {
    try {
        // Use findByIdAndUpdate to update the data
        const updatedUser = await userModel.findByIdAndUpdate(
            req.body.userId,
            { name: req.body.name, email: req.body.email, phone: req.body.phone },
            { new: true }
        );
        
        // Remove the password from the response for security
        updatedUser.password = undefined;

        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Failed to update user profile'
        });
    }
};

// Check doctor schedule availability for a specific date and time
const checkAvailabilityController = async (req, res) => {
    try {
        const { date, time, doctorId } = req.body;

        // Check whether an appointment already exists for the same doctor, date, and time
        const appointments = await appointmentModel.find({
            doctorInfo: doctorId,
            date: date,
            time: time
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                message: 'Schedule is unavailable. The doctor already has an appointment at that time.',
                success: false,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: 'Schedule is available. Please continue with the booking.',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while checking schedule availability'
        });
    }
};

module.exports = { 
    loginController, 
    registerController, 
    authController, 
    applyDoctorController, 
    markAllNotificationController,
    getAllApprovedDoctorsController,
    getDoctorByIdController,
    bookAppointmentController,
    userAppointmentsController,
    updateUserProfileController,
    checkAvailabilityController
};