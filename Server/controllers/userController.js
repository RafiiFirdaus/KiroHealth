const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller Registrasi
const registerController = async (req, res) => {
    try {
        // Cek apakah email sudah ada di database
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: 'Email sudah terdaftar', success: false });
        }

        // Hash password menggunakan bcrypt
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        // Simpan user baru
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: 'Registrasi Berhasil', success: true });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Error Register Controller: ${error.message}` });
    }
};

// Controller Login
const loginController = async (req, res) => {
    try {
        // Cek apakah user ada di database
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: 'Pengguna tidak ditemukan', success: false });
        }

        // Cocokkan password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Email atau Password salah', success: false });
        }

        // Generate Token JWT (berlaku 1 hari)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: 'Login Berhasil', success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error Login Controller: ${error.message}`, success: false });
    }
};

// Controller untuk mengambil data user yang sedang login
const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({ message: 'Pengguna tidak ditemukan', success: false });
        } else {
            // Sembunyikan password sebelum dikirim sebagai respon
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
        
        // --- LOGIKA NOTIFIKASI BARU ---
        // Cari pengguna yang memiliki role admin
        const adminUser = await userModel.findOne({ type: 'admin' });
        
        if (adminUser) {
            const notification = adminUser.notification;
            notification.push({
                type: 'apply-doctor-request',
                message: `${newDoctor.fullname} telah mengajukan diri sebagai dokter.`,
                data: {
                    doctorId: newDoctor._id,
                    name: newDoctor.fullname,
                    onClickPath: '/admin/doctors'
                }
            });
            // Update data admin dengan notifikasi baru
            await userModel.findByIdAndUpdate(adminUser._id, { notification });
        }
        // ------------------------------
        
        res.status(201).send({
            success: true,
            message: 'Pengajuan akun dokter berhasil dikirim dan menunggu persetujuan admin',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Error saat memproses pengajuan dokter' });
    }
};

// Controller untuk menandai semua notifikasi telah dibaca
const markAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const unreadNotifications = user.notification;
        
        // Pindahkan notifikasi yang belum dibaca ke array seen_notification (jika kita ingin menyimpannya)
        // Untuk saat ini, kita akan mengosongkan notifikasi aktif saja agar sederhana
        user.notification = []; 
        
        const updatedUser = await user.save();
        updatedUser.password = undefined; // Sembunyikan password

        res.status(200).send({
            success: true,
            message: 'Semua notifikasi telah ditandai dibaca',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error saat membaca notifikasi', success: false, error });
    }
};

// Mengambil semua dokter yang statusnya "approved"
const getAllApprovedDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: 'Daftar dokter berhasil diambil',
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error saat mengambil data dokter',
        });
    }
};

// Mengambil detail satu dokter berdasarkan ID
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({ success: true, message: 'Data dokter berhasil diambil', data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Gagal mengambil data dokter' });
    }
};

// Menyimpan jadwal pemesanan dan mengirim notifikasi ke dokter
const bookAppointmentController = async (req, res) => {
    try {
        // Simpan data pemesanan ke database
        const newAppointment = new appointmentModel({
            userInfo: req.body.userId, // ID Pasien (dari middleware)
            doctorInfo: req.body.doctorId, // ID Dokter (dari frontend)
            date: req.body.date,
            time: req.body.time,
            status: 'pending'
        });
        await newAppointment.save();

        // Cari data akun utama milik dokter tersebut untuk dikirimi notifikasi
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        const user = await userModel.findOne({ _id: doctor.userId });
        
        user.notification.push({
            type: 'New-appointment-request',
            message: `Ada permintaan janji temu baru pada ${req.body.date} jam ${req.body.time}`,
            onClickPath: '/doctor/appointments'
        });
        await user.save();

        res.status(200).send({ success: true, message: 'Janji temu berhasil diajukan!' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error, message: 'Gagal membuat janji temu' });
    }
};

// Mengambil daftar janji temu khusus untuk user (pasien) yang sedang login
const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userInfo: req.body.userId }).populate('doctorInfo');
        res.status(200).send({
            success: true,
            message: 'Riwayat janji temu berhasil diambil',
            data: appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Gagal mengambil riwayat janji temu'
        });
    }
};

// Memperbarui profil pengguna (Pasien/Admin)
const updateUserProfileController = async (req, res) => {
    try {
        // Menggunakan findByIdAndUpdate untuk memperbarui data
        const updatedUser = await userModel.findByIdAndUpdate(
            req.body.userId,
            { name: req.body.name, email: req.body.email, phone: req.body.phone },
            { new: true }
        );
        
        // Hapus password dari respons demi keamanan
        updatedUser.password = undefined;

        res.status(200).send({
            success: true,
            message: 'Profil berhasil diperbarui',
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Gagal memperbarui profil pengguna'
        });
    }
};

// Mengecek ketersediaan jadwal dokter pada tanggal dan jam tertentu
const checkAvailabilityController = async (req, res) => {
    try {
        const { date, time, doctorId } = req.body;

        // Cari apakah ada jadwal dengan dokter, tanggal, dan jam yang sama persis
        const appointments = await appointmentModel.find({
            doctorInfo: doctorId,
            date: date,
            time: time
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                message: 'Jadwal tidak tersedia, dokter sudah ada janji pada waktu tersebut',
                success: false,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: 'Jadwal tersedia! Silakan lanjutkan pemesanan.',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error saat mengecek ketersediaan jadwal'
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