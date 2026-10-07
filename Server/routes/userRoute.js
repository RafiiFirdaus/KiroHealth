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

// ROUTE POST || APPLY DOCTOR (TERPROTEKSI)
router.post('/apply-doctor', authMiddleware, applyDoctorController);

// ROUTE POST || TANDAI NOTIFIKASI DIBACA
router.post('/get-all-notification', authMiddleware, markAllNotificationController);

// ROUTE GET || AMBIL DAFTAR DOKTER DI BERANDA
router.get('/getAllDoctors', authMiddleware, getAllApprovedDoctorsController);

// ROUTE POST || AMBIL DETAIL SATU DOKTER
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

// ROUTE POST || BUAT JANJI TEMU
router.post('/book-appointment', authMiddleware, bookAppointmentController);

// ROUTE GET || AMBIL RIWAYAT JANJI TEMU PASIEN
router.get('/user-appointments', authMiddleware, userAppointmentsController);

// ROUTE POST || UPDATE PROFIL USER
router.post('/update-profile', authMiddleware, updateUserProfileController);

// ROUTE POST || CEK KETERSEDIAAN JADWAL
router.post('/check-booking-availability', authMiddleware, checkAvailabilityController);

module.exports = router;