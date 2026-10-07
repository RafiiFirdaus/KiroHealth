const express = require('express');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ROUTE GET || AMBIL SEMUA USER
router.get('/getAllUsers', authMiddleware, getAllUsersController);

// ROUTE GET || AMBIL SEMUA DOKTER
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// ROUTE POST || UBAH STATUS DOKTER
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

module.exports = router;