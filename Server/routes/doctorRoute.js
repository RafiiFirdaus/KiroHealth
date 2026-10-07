const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { doctorAppointmentsController, 
    getDoctorInfoController,
    updateProfileController,
    updateStatusController } = require('../controllers/doctorController');
const router = express.Router();

// GET || Fetch schedule list
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);
// POST || Update status (Accept/Reject)
router.post('/update-status', authMiddleware, updateStatusController);

// ROUTE GET || Fetch schedule list
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);
// ROUTE POST || Update status (Accept/Reject)
router.post('/update-status', authMiddleware, updateStatusController);

// ROUTE POST || Fetch doctor profile info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);
// ROUTE POST || Update doctor profile
router.post('/updateProfile', authMiddleware, updateProfileController);

module.exports = router;