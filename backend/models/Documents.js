const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  content: {
    type: mongoose.Schema.Types.Mixed, // or simply: Object
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Document', documentSchema);
