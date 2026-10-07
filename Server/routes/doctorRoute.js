const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { doctorAppointmentsController, 
    getDoctorInfoController,
    updateProfileController,
    updateStatusController } = require('../controllers/doctorController');
const router = express.Router();

// GET || Ambil Daftar Jadwal
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);
// POST || Update Status (Terima/Tolak)
router.post('/update-status', authMiddleware, updateStatusController);

// ROUTE GET || Ambil Daftar Jadwal
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);
// ROUTE POST || Update Status (Terima/Tolak)
router.post('/update-status', authMiddleware, updateStatusController);

// ROUTE POST || Ambil Info Profil Dokter
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);
// ROUTE POST || Update Profil Dokter
router.post('/updateProfile', authMiddleware, updateProfileController);

module.exports = router;