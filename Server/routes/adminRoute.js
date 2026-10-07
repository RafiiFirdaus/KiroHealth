const express = require('express');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ROUTE GET || FETCH ALL USERS
router.get('/getAllUsers', authMiddleware, getAllUsersController);

// ROUTE GET || FETCH ALL DOCTORS
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// ROUTE POST || CHANGE DOCTOR STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

module.exports = router;