const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    doctorInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctors', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: 'pending' },
    document: { type: String } // Untuk menyimpan link/path dokumen rekam medis
}, {
    timestamps: true
});

const appointmentModel = mongoose.model('Appointments', appointmentSchema);
module.exports = appointmentModel;