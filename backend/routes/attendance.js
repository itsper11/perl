const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// GET attendance (protected)
router.get('/', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST attendance (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, course, yearLevel, status } = req.body;

    const newAttendance = new Attendance({
      name,
      course,
      yearLevel,
      status,
      user: req.user.userId,
    });

    await newAttendance.save();
    res.json(newAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (Update) attendance record (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, course, yearLevel, status } = req.body;
    
    const updatedRecord = await Attendance.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId }, // Ensure user owns the record
      { name, course, yearLevel, status },
      { new: true } // Return the updated document
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(updatedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE attendance record (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedRecord = await Attendance.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId // Ensure user owns the record
    });

    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;