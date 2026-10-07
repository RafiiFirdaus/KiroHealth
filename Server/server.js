const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/doctor', require('./routes/doctorRoute'));

// Eksekusi Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Berhasil terhubung ke MongoDB'))
  .catch((err) => console.log('Gagal terhubung ke MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Server Backend KiroHealth Berjalan!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});