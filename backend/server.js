const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/MySchedule');
const listScheduleRoutes = require('./routes/CreateList');
const auth = require('./middleware/auth');
const documentRoutes = require('./routes/documents');
const jwt = require('jsonwebtoken');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const server = http.createServer(app);

// Express middleware - simplified CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/mylistsched', listScheduleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/docs', documentRoutes); // <--- mount the route


const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});