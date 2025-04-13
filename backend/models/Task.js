const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for better performance
taskSchema.index({ user: 1, date: 1 });
taskSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('Task', taskSchema);