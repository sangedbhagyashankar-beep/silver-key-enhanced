import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model.js';
import { sendEmail } from '../services/email.service.js';
import { AppError } from '../utils/AppError.js';
import logger from '../utils/logger.js';

// ─── Token helpers ────────────────────────────────────────────────
const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });

const sendTokens = async (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: user.toSafeJSON(),
  });
};

// ─── Register ────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already registered', 409));

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      emailVerificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
    });

    // Send verification email (non-blocking — don't fail registration if email fails)
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    sendEmail({
      to: user.email,
      subject: 'Welcome to Silver Key Hotel — Verify Your Email',
      template: 'emailVerification',
      data: { name: user.firstName, verifyUrl },
    }).catch(() => {});

    await sendTokens(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError('Email and password are required', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) return next(new AppError('Account suspended. Contact support.', 403));

    logger.info(`User login: ${user.email} [${user.role}]`);
    await sendTokens(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Token ────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return next(new AppError('No refresh token', 401));

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: hashedToken,
      isActive: true,
    });

    if (!user) return next(new AppError('Invalid or expired refresh token', 401));

    const newAccessToken = signAccessToken(user._id);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    next(new AppError('Invalid refresh token', 401));
  }
};

// ─── Logout ──────────────────────────────────────────────────────
// FIX: Logout works even without a valid access token (uses refresh cookie or userId from token)
export const logout = async (req, res, next) => {
  try {
    // Try to clear the refresh token in DB if we can identify the user
    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null }).catch(() => {});
    } else {
      // Try to identify via refresh cookie even if access token expired
      const refreshCookie = req.cookies?.refreshToken;
      if (refreshCookie) {
        try {
          const decoded = jwt.verify(refreshCookie, process.env.JWT_REFRESH_SECRET);
          await User.findByIdAndUpdate(decoded.id, { refreshToken: null }).catch(() => {});
        } catch {}
      }
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    // Always succeed on logout
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out' });
  }
};

// ─── Get Me ──────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// ─── Forgot Password ─────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('No account with that email', 404));

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Silver Key Hotel — Password Reset Request',
      template: 'passwordReset',
      data: { name: user.firstName, resetUrl, expiry: '1 hour' },
    });

    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (err) {
    next(err);
  }
};

// ─── Reset Password ──────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return next(new AppError('Token invalid or expired', 400));

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await sendTokens(user, 200, res);
  } catch (err) {
    next(err);
  }
};
