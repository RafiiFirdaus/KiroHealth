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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('KiroHealth backend server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});