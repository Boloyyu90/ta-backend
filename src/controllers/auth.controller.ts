// src/controllers/auth.controller.ts
import { UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import exclude from '../utils/exclude';
import {
  ForgotPasswordRequestBody,
  ForgotPasswordRequestParams,
  ForgotPasswordRequestQuery,
  ForgotPasswordResponseBody,
  LoginRequestBody,
  LoginRequestParams,
  LoginRequestQuery,
  LoginResponseBody,
  LogoutRequestBody,
  LogoutRequestParams,
  LogoutRequestQuery,
  LogoutResponseBody,
  RefreshTokensRequestBody,
  RefreshTokensRequestParams,
  RefreshTokensRequestQuery,
  RefreshTokensResponseBody,
  RegisterRequestBody,
  RegisterRequestParams,
  RegisterRequestQuery,
  RegisterResponseBody,
  ResetPasswordRequestBody,
  ResetPasswordRequestParams,
  ResetPasswordRequestQuery,
  ResetPasswordResponseBody,
  SendVerificationEmailRequestBody,
  SendVerificationEmailRequestParams,
  SendVerificationEmailRequestQuery,
  SendVerificationEmailResponseBody,
  TestEmailRequestBody,
  TestEmailRequestParams,
  TestEmailRequestQuery,
  TestEmailResponseBody,
  VerifyEmailRequestBody,
  VerifyEmailRequestParams,
  VerifyEmailRequestQuery,
  VerifyEmailResponseBody
} from '../types/http/auth';

// ============================================
// INTERFACE DEFINITION
// ============================================
interface AuthController {
  register: RequestHandler<
    RegisterRequestParams,
    RegisterResponseBody,
    RegisterRequestBody,
    RegisterRequestQuery
  >;
  login: RequestHandler<
    LoginRequestParams,
    LoginResponseBody,
    LoginRequestBody,
    LoginRequestQuery
  >;
  logout: RequestHandler<
    LogoutRequestParams,
    LogoutResponseBody,
    LogoutRequestBody,
    LogoutRequestQuery
  >;
  refreshTokens: RequestHandler<
    RefreshTokensRequestParams,
    RefreshTokensResponseBody,
    RefreshTokensRequestBody,
    RefreshTokensRequestQuery
  >;
  forgotPassword: RequestHandler<
    ForgotPasswordRequestParams,
    ForgotPasswordResponseBody,
    ForgotPasswordRequestBody,
    ForgotPasswordRequestQuery
  >;
  resetPassword: RequestHandler<
    ResetPasswordRequestParams,
    ResetPasswordResponseBody,
    ResetPasswordRequestBody,
    ResetPasswordRequestQuery
  >;
  sendVerificationEmail: RequestHandler<
    SendVerificationEmailRequestParams,
    SendVerificationEmailResponseBody,
    SendVerificationEmailRequestBody,
    SendVerificationEmailRequestQuery
  >;
  verifyEmail: RequestHandler<
    VerifyEmailRequestParams,
    VerifyEmailResponseBody,
    VerifyEmailRequestBody,
    VerifyEmailRequestQuery
  >;
  testEmail: RequestHandler<
    TestEmailRequestParams,
    TestEmailResponseBody,
    TestEmailRequestBody,
    TestEmailRequestQuery
  >;
}

// ============================================
// CONTROLLER IMPLEMENTATION
// ============================================

const register = catchAsync<
  RegisterRequestParams,
  RegisterResponseBody,
  RegisterRequestBody,
  RegisterRequestQuery
>(async (req, res) => {
  const { email, password, name } = req.body;

  const user = await userService.createUser(email, password, name, UserRole.PARTICIPANT);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);

  try {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, verifyEmailToken);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${user.email}:`, error);
  }

  res.status(httpStatus.CREATED).send({
    user: userWithoutPassword,
    tokens,
    message: 'Registration successful. Please check your email to verify your account.',
    emailVerificationRequired: true
  });
});

const login = catchAsync<
  LoginRequestParams,
  LoginResponseBody,
  LoginRequestBody,
  LoginRequestQuery
>(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync<
  LogoutRequestParams,
  LogoutResponseBody,
  LogoutRequestBody,
  LogoutRequestQuery
>(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync<
  RefreshTokensRequestParams,
  RefreshTokensResponseBody,
  RefreshTokensRequestBody,
  RefreshTokensRequestQuery
>(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync<
  ForgotPasswordRequestParams,
  ForgotPasswordResponseBody,
  ForgotPasswordRequestBody,
  ForgotPasswordRequestQuery
>(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync<
  ResetPasswordRequestParams,
  ResetPasswordResponseBody,
  ResetPasswordRequestBody,
  ResetPasswordRequestQuery
>(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync<
  SendVerificationEmailRequestParams,
  SendVerificationEmailResponseBody,
  SendVerificationEmailRequestBody,
  SendVerificationEmailRequestQuery
>(async (req, res) => {
  const user = req.user as { id: number; email: string };
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync<
  VerifyEmailRequestParams,
  VerifyEmailResponseBody,
  VerifyEmailRequestBody,
  VerifyEmailRequestQuery
>(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Email verified successfully.'
  });
});

const testEmail = catchAsync<
  TestEmailRequestParams,
  TestEmailResponseBody,
  TestEmailRequestBody,
  TestEmailRequestQuery
>(async (req, res) => {
  const { email } = req.body;
  await emailService.sendTestEmail(email);
  res.send({
    message: 'Test email sent successfully',
    recipient: email,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// TYPED EXPORT
// ============================================
const authController: AuthController = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  testEmail
};

export default authController;
