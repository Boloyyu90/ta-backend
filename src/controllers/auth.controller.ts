import { UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import exclude from '../utils/exclude';
import {
  ForgotPasswordRequestBody,
  ForgotPasswordRequestParams,
  ForgotPasswordRequestQuery,
  LoginRequestBody,
  LoginRequestParams,
  LoginRequestQuery,
  LogoutRequestBody,
  LogoutRequestParams,
  LogoutRequestQuery,
  RefreshTokensRequestBody,
  RefreshTokensRequestParams,
  RefreshTokensRequestQuery,
  RegisterRequestBody,
  RegisterRequestParams,
  RegisterRequestQuery,
  ResetPasswordRequestBody,
  ResetPasswordRequestParams,
  ResetPasswordRequestQuery,
  SendVerificationEmailRequestBody,
  SendVerificationEmailRequestParams,
  SendVerificationEmailRequestQuery,
  TestEmailRequestBody,
  TestEmailRequestParams,
  TestEmailRequestQuery,
  VerifyEmailRequestBody,
  VerifyEmailRequestParams,
  VerifyEmailRequestQuery
} from '../types/http/auth';

  const register = catchAsync(
    async (
      req: Request<RegisterRequestParams, unknown, RegisterRequestBody, RegisterRequestQuery>,
      res: Response<unknown>
    ) => {
      const { email, password, name } = req.body;

      // Create user (self-registration always creates participants)
      const user = await userService.createUser(email, password, name, UserRole.PARTICIPANT);
      const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);

      // Generate tokens
      const tokens = await tokenService.generateAuthTokens(user);
        // Auto-send verification email
        try {
          const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
          await emailService.sendVerificationEmail(user.email, verifyEmailToken);
          console.log(`Verification email sent to ${user.email}`);
        } catch (error) {
          console.error(`Failed to send verification email to ${user.email}:`, error);
          // Don't fail registration - log error and continue
        }

        res.status(httpStatus.CREATED).send({
          user: userWithoutPassword,
          tokens,
          message: 'Registration successful. Please check your email to verify your account.',
          emailVerificationRequired: true
        });
      }
    );

    const login = catchAsync(
      async (
        req: Request<LoginRequestParams, unknown, LoginRequestBody, LoginRequestQuery>,
        res: Response<unknown>
      ) => {
        const { email, password } = req.body;
        const user = await authService.loginUserWithEmailAndPassword(email, password);
        const tokens = await tokenService.generateAuthTokens(user);
        res.send({ user, tokens });
      }
    );

    const logout = catchAsync(
      async (
        req: Request<LogoutRequestParams, unknown, LogoutRequestBody, LogoutRequestQuery>,
        res: Response<unknown>
      ) => {
        await authService.logout(req.body.refreshToken);
        res.status(httpStatus.NO_CONTENT).send();
      }
    );

    const refreshTokens = catchAsync(
      async (
        req: Request<RefreshTokensRequestParams, unknown, RefreshTokensRequestBody, RefreshTokensRequestQuery>,
        res: Response<unknown>
      ) => {
        const tokens = await authService.refreshAuth(req.body.refreshToken);
        res.send({ ...tokens });
      }
    );

    const forgotPassword = catchAsync(
      async (
        req: Request<
          ForgotPasswordRequestParams,
          unknown,
          ForgotPasswordRequestBody,
          ForgotPasswordRequestQuery
        >,
        res: Response<unknown>
      ) => {
        const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
        await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
        res.status(httpStatus.NO_CONTENT).send();
      }
    );


    const resetPassword = catchAsync(
      async (
        req: Request<ResetPasswordRequestParams, unknown, ResetPasswordRequestBody, ResetPasswordRequestQuery>,
        res: Response<unknown>
      ) => {
        await authService.resetPassword(req.query.token, req.body.password);
        res.status(httpStatus.NO_CONTENT).send();
      }
    );


    const sendVerificationEmail = catchAsync(
      async (
        req: Request<
          SendVerificationEmailRequestParams,
          unknown,
          SendVerificationEmailRequestBody,
          SendVerificationEmailRequestQuery
        >,
        res: Response<unknown>
      ) => {
        const user = req.user as { id: number; email: string };
        const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
        await emailService.sendVerificationEmail(user.email, verifyEmailToken);
        res.status(httpStatus.NO_CONTENT).send();
      }
    );

  const verifyEmail = catchAsync(
    async (
      req: Request<VerifyEmailRequestParams, unknown, VerifyEmailRequestBody, VerifyEmailRequestQuery>,
      res: Response<unknown>
    ) => {
    try {
      await authService.verifyEmail(req.query.token);
      return res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Email verified successfully.'
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string } | undefined;
      const statusCode =
        typeof err?.statusCode === 'number' ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
      const message = err?.message || 'Email verification failed.';

            return res.status(statusCode).json({
              status: 'error',
              message
            });
          }
        }
    );


  const testEmail = catchAsync(
    async (
      req: Request<TestEmailRequestParams, unknown, TestEmailRequestBody, TestEmailRequestQuery>,
      res: Response<unknown>
    ) => {
      const { email } = req.body;
      await emailService.sendTestEmail(email);
      res.send({
        message: 'Test email sent successfully',
        recipient: email,
        timestamp: new Date().toISOString()
      });
  });

  export default {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
    testEmail // Add this
  };
