const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const Schedule = require('../models/Schedule');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
router.use(apiLimiter);

// GET all schedule items for user
router.get('/', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.userId })
      .sort({ date: 1, startTime: 1 })
      .lean();
      
    res.json(schedules);
  } catch (err) {
    console.error('GET schedules error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch schedule items',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST new schedule item
router.post('/', auth, async (req, res) => {
  try {
    const schedule = new Schedule({
      ...req.body,
      user: req.user.userId
    });

    await schedule.validate(); // Explicit validation
    
    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    console.error('POST schedule error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: err.errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create schedule item',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// UPDATE schedule item
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ 
        error: 'Schedule not found or not authorized' 
      });
    }

    res.json(schedule);
  } catch (err) {
    console.error('PUT schedule error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: err.errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update schedule item',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE schedule item
router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!schedule) {
      return res.status(404).json({ 
        error: 'Schedule not found or not authorized' 
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE schedule error:', err);
    res.status(500).json({ 
      error: 'Failed to delete schedule item',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;