import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { seedDatabase } from './seed.js';

export const connectDB = async function() {
  try {
    var conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    logger.info('MongoDB connected: ' + conn.connection.host);
    await seedDatabase();
  } catch (err) {
    logger.error('MongoDB connection failed: ' + err.message);
    process.exit(1);
  }
  mongoose.connection.on('disconnected', function() { logger.warn('MongoDB disconnected'); });
  mongoose.connection.on('reconnected', function() { logger.info('MongoDB reconnected'); });
};
