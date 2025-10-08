 

// server/models/Design.js
const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  userId: { type: String, required: true },  
  title: { type: String, required: true },
  jsonData: { type: Object, required: true },
  s3Url: { type: String },  // ✅ add this (was missing)
  thumbnailUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Design', DesignSchema);
