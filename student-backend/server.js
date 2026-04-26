const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars at the very top
dotenv.config();

// Verify and log API Key to console securely
const keyToLog = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) + '...' : 'UNDEFINED';
console.log(`[VERIFICATION] Loaded GEMINI_API_KEY from .env starts with: ${keyToLog}`);

const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Health check route
app.get('/health', (req, res) => res.json({ status: "OK" }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teacher-ai', require('./routes/teacherAIRoutes'));

// Connect to Database and start server
mongoose.connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Only start server if DB is successful
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.warn("Could not connect to database. Server failed to start.");
    process.exit(1);
  });
