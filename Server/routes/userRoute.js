const express = require('express');
const { 
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
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/getUserData', authMiddleware, authController);

// ROUTE POST || APPLY DOCTOR (PROTECTED)
router.post('/apply-doctor', authMiddleware, applyDoctorController);

// ROUTE POST || MARK NOTIFICATIONS AS READ
router.post('/get-all-notification', authMiddleware, markAllNotificationController);

// ROUTE GET || FETCH DOCTOR LIST ON THE HOME PAGE
router.get('/getAllDoctors', authMiddleware, getAllApprovedDoctorsController);

// ROUTE POST || FETCH ONE DOCTOR'S DETAILS
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

// ROUTE POST || CREATE APPOINTMENT
router.post('/book-appointment', authMiddleware, bookAppointmentController);

// ROUTE GET || FETCH PATIENT APPOINTMENT HISTORY
router.get('/user-appointments', authMiddleware, userAppointmentsController);

// ROUTE POST || UPDATE USER PROFILE
router.post('/update-profile', authMiddleware, updateUserProfileController);

// ROUTE POST || CHECK SCHEDULE AVAILABILITY
router.post('/check-booking-availability', authMiddleware, checkAvailabilityController);

module.exports = router;