import express from 'express';
import validate from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import { authController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// POST /auth/register
router.post(
  '/register',a
  validate(authValidation.register),
  authController.register
);

// POST /auth/login
router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);

// POST /auth/logout
router.post(
  '/logout',
  validate(authValidation.logout),
  authController.logout
);

// POST /auth/refresh-tokens
router.post(
  '/refresh-tokens',
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

// POST /auth/forgot-password
router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

// POST /auth/reset-password
router.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

// POST /auth/verify-email (for POST requests with token in query)
router.post(
  '/verify-email',
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

// GET /auth/verify-email (for email link clicks)
router.get(
  '/verify-email',
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

// ============================================
// PROTECTED ROUTES
// ============================================

// POST /auth/send-verification-email
router.post(
  '/send-verification-email',
  auth(),
  authController.sendVerificationEmail
);

// POST /auth/test-email (optional: for development only)
router.post(
  '/test-email',
  validate(authValidation.testEmail),
  authController.testEmail
);

export default router;
