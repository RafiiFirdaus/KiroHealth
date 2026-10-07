const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');

// Mengambil semua data pengguna
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({ success: true, message: 'Data pengguna berhasil diambil', data: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal mengambil data pengguna', error });
    }
};

// Mengambil semua data dokter
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({ success: true, message: 'Data dokter berhasil diambil', data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal mengambil data dokter', error });
    }
};

// Mengubah status persetujuan dokter
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });
        
        // Cari akun user (pasien) yang terkait dengan dokter ini untuk diberi notifikasi
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Pengajuan akun dokter Anda telah di-${status === 'approved' ? 'setujui' : 'tolak'}`,
            onClickPath: '/notification'
        });
        
        // Jika disetujui, ubah status isdoctor menjadi true
        user.isdoctor = status === 'approved' ? true : false;
        await user.save();

        res.status(201).send({ success: true, message: 'Status akun dokter berhasil diperbarui', data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal memperbarui status akun', error });
    }
};

module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController };