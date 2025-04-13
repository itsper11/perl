const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
router.use(apiLimiter);

// Validation middleware
const validateTaskInput = (req, res, next) => {
  const { title, date, time } = req.body;
  
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
  if (isNaN(Date.parse(date))) return res.status(400).json({ error: 'Invalid date format' });
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format (HH:MM required)' });
  }
  
  next();
};

// GET all tasks for user
router.get('/', auth, async (req, res) => {
  try { 
    const tasks = await Task.find({ user: req.user.userId})
      .sort({ date: 1, time: 1 })
      .select('-__v'); // Exclude version key
    
    res.json(tasks);
  } catch (err) {
    console.error('GET tasks error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST new task
router.post('/', auth, validateTaskInput, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title.trim(),
      date: req.body.date,
      time: req.body.time,
      user: req.user.userId
    });

    await task.save();
    
    res.status(201).json({
      _id: task._id,
      title: task.title,
      date: task.date,
      time: task.time,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  } catch (err) {
    console.error('POST task error:', err);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PATCH toggle task completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      [{ $set: { completed: { $not: "$completed" } } }],
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.json(task);
  } catch (err) {
    console.error('TOGGLE completion error:', err);
    res.status(500).json({ 
      error: 'Failed to update task status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE task error:', err);
    res.status(500).json({ 
      error: 'Failed to delete task',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;