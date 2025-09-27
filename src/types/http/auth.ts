// src/types/http/auth.ts
import { EmptyObject } from './common';

// ============================================
// REGISTER
// ============================================
export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export type RegisterRequestParams = EmptyObject;
export type RegisterRequestQuery = EmptyObject;
export type RegisterResponseBody = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    isEmailVerified: boolean;
  };
  tokens: {
    access: { token: string; expires: Date };
    refresh: { token: string; expires: Date };
  };
  message: string;
  emailVerificationRequired: boolean;
};

// ============================================
// LOGIN
// ============================================
export interface LoginRequestBody {
  email: string;
  password: string;
}

export type LoginRequestParams = EmptyObject;
export type LoginRequestQuery = EmptyObject;
export type LoginResponseBody = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    isEmailVerified: boolean;
  };
  tokens: {
    access: { token: string; expires: Date };
    refresh: { token: string; expires: Date };
  };
};

// ============================================
// LOGOUT
// ============================================
export interface LogoutRequestBody {
  refreshToken: string;
}

export type LogoutRequestParams = EmptyObject;
export type LogoutRequestQuery = EmptyObject;
export type LogoutResponseBody = void; // ✅ No content response

// ============================================
// REFRESH TOKENS
// ============================================
export interface RefreshTokensRequestBody {
  refreshToken: string;
}

export type RefreshTokensRequestParams = EmptyObject;
export type RefreshTokensRequestQuery = EmptyObject;
export type RefreshTokensResponseBody = {
  access: { token: string; expires: Date };
  refresh: { token: string; expires: Date };
};

// ============================================
// FORGOT PASSWORD
// ============================================
export interface ForgotPasswordRequestBody {
  email: string;
}

export type ForgotPasswordRequestParams = EmptyObject;
export type ForgotPasswordRequestQuery = EmptyObject;
export type ForgotPasswordResponseBody = void; // ✅ No content response

// ============================================
// RESET PASSWORD
// ============================================
export interface ResetPasswordRequestBody {
  password: string;
}

export interface ResetPasswordRequestQuery {
  token: string;
}

export type ResetPasswordRequestParams = EmptyObject;
export type ResetPasswordResponseBody = void; // ✅ No content response

// ============================================
// SEND VERIFICATION EMAIL
// ============================================
export type SendVerificationEmailRequestParams = EmptyObject;
export type SendVerificationEmailRequestQuery = EmptyObject;
export type SendVerificationEmailRequestBody = EmptyObject;
export type SendVerificationEmailResponseBody = void; // ✅ No content response

// ============================================
// VERIFY EMAIL
// ============================================
export interface VerifyEmailRequestQuery {
  token: string;
}

export type VerifyEmailRequestParams = EmptyObject;
export type VerifyEmailRequestBody = EmptyObject;
export type VerifyEmailResponseBody = {
  status: 'success' | 'error';
  message: string;
};

// ============================================
// TEST EMAIL
// ============================================
export interface TestEmailRequestBody {
  email: string;
}

export type TestEmailRequestParams = EmptyObject;
export type TestEmailRequestQuery = EmptyObject;
export type TestEmailResponseBody = {
  message: string;
  recipient: string;
  timestamp: string;
};
