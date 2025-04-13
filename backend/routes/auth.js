const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Register new user (MongoDB version)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists (MongoDB syntax)
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user (MongoDB syntax)
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { id: user._id, username, email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login user (MongoDB version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Find user (MongoDB syntax)
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;