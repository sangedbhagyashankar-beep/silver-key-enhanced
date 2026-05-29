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

import authRoutes    from './routes/auth.routes.js';
import roomRoutes    from './routes/room.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes  from './routes/review.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import adminRoutes   from './routes/admin.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';

const app = express();

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(mongoSanitize());

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false }));

app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', function(req, res) {
  res.json({ success: true, message: 'Silver Key Hotel API running', env: process.env.NODE_ENV });
});

app.use('/api/auth',      authRoutes);
app.use('/api/rooms',     roomRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/gallery',   galleryRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/chatbot',   chatbotRoutes);
app.use('/api/whatsapp',  whatsappRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
connectDB().then(function() {
  app.listen(PORT, function() {
    logger.info('Silver Key Hotel API running on port ' + PORT);
  });
}).catch(function(err) {
  logger.error('Failed to connect DB: ' + err.message);
  process.exit(1);
});

export default app;
