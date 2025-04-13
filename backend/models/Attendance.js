const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  yearLevel: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Excuse'],
    required: true,
  },
  
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure you have a User model
    required: true,
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
