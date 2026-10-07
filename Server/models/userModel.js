const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, default: 'patient' },
    isdoctor: { type: Boolean, default: false },
    notification: { type: Array, default: [] }
}, {
    timestamps: true // Otomatis menambahkan createdAt dan updatedAt
});

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;