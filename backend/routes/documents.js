const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Document = require('../models/Documents');

// Save a new document
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newDoc = new Document({ 
      title, 
      content,
      user: req.user.userId, 
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save document' });
  }
});

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.userId }); 
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.get('/recent', auth, async (req, res) => {
  try {
    const recentDocs = await Document.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(recentDocs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// In your backend route (e.g., routes/docs.js)
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add this to your existing routes
router.get('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
