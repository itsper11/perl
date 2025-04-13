const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  console.log('Auth middleware triggered');
  
  try {
    // 1. Get token from header
    const authHeader = req.header('Authorization');
    console.log('Raw Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    

    req.user = {
      userId: decoded.userId 
    };
    
    console.log('Authenticated user ID:', req.user.userId);
    next();
    
  } catch (err) {
    console.log('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;