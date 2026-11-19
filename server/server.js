require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Static serving of uploaded photo files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Alzikrayat MERN REST API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    aiModel: process.env.ZAI_MODEL || 'glm-4.6v-flash',
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/photos', commentRoutes);
app.use('/api/ai', aiRoutes);

// 404 and Centralized Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  if (!MONGODB_URI) {
    console.error('FATAL: MONGODB_URI is not defined in server/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[MongoDB] Connected successfully');

    app.listen(PORT, () => {
      console.log(`[Server] Alzikrayat API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
