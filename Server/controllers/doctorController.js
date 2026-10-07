const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModel');

// Mengambil jadwal janji temu khusus untuk dokter ini
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({ doctorInfo: doctor._id }).populate('userInfo');
        res.status(200).send({ success: true, message: 'Jadwal berhasil diambil', data: appointments });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal mengambil jadwal', error });
    }
};

// Mengubah status janji temu (Terima/Tolak)
const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, { status });
        
        // Kirim notifikasi ke pasien
        const user = await userModel.findOne({ _id: appointments.userInfo });
        user.notification.push({
            type: 'status-updated',
            message: `Permintaan janji temu Anda telah di-${status === 'approved' ? 'Setujui' : 'Tolak'}`,
            onClickPath: '/appointments'
        });
        await user.save();
        
        res.status(200).send({ success: true, message: 'Status janji temu berhasil diperbarui' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal update status', error });
    }
};

// Mengambil data profil dokter untuk ditampilkan di form
const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'Data profil berhasil diambil',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal mengambil data profil', error });
    }
};

// Menyimpan perubahan profil dokter
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.body.userId },
            req.body,
            { new: true } // Mengembalikan data terbaru setelah diupdate
        );
        res.status(200).send({
            success: true,
            message: 'Profil Dokter Berhasil Diperbarui',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Gagal memperbarui profil', error });
    }
};

module.exports = { doctorAppointmentsController, 
    updateStatusController, 
    getDoctorInfoController, 
    updateProfileController };