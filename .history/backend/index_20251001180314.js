// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const designRoutes = require('./routes/designs');

const app = express();
app.use(cors());

// Increase body size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mattydb';
mongoose.connect(MONGO, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on', PORT));
// console.log("S3 Bucket:", process.env.AWS_S3_BUCKET);

