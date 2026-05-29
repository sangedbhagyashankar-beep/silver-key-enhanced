import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import adminRoutes from './routes/admin.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use(mongoSanitize());

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// CORS Configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan('dev'));

// Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Silver Key Hotel API running successfully',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 10000;

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      logger.info(`Silver Key Hotel API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect database:', error.message);
    logger.error(`Failed to connect DB: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
