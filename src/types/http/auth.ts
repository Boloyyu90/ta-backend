import { EmptyObject } from './common';

export type UserRoleString = 'ADMIN' | 'PARTICIPANT';

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: UserRoleString;
}

export type RegisterRequestParams = EmptyObject;
export type RegisterRequestQuery = EmptyObject;

export interface LoginRequestBody {
  email: string;
  password: string;
}

export type LoginRequestParams = EmptyObject;
export type LoginRequestQuery = EmptyObject;

export interface LogoutRequestBody {
  refreshToken: string;
}

export type LogoutRequestParams = EmptyObject;
export type LogoutRequestQuery = EmptyObject;

export interface RefreshTokensRequestBody {
  refreshToken: string;
}

export type RefreshTokensRequestParams = EmptyObject;
export type RefreshTokensRequestQuery = EmptyObject;

export interface ForgotPasswordRequestBody {
  email: string;
}

export type ForgotPasswordRequestParams = EmptyObject;
export type ForgotPasswordRequestQuery = EmptyObject;

export interface ResetPasswordRequestBody {
  password: string;
}

export interface ResetPasswordRequestQuery {
  token: string;
}

export type ResetPasswordRequestParams = EmptyObject;

export type SendVerificationEmailRequestParams = EmptyObject;
export type SendVerificationEmailRequestQuery = EmptyObject;
export type SendVerificationEmailRequestBody = EmptyObject;

export interface VerifyEmailRequestQuery {
  token: string;
}

export type VerifyEmailRequestParams = EmptyObject;
export type VerifyEmailRequestBody = EmptyObject;

export interface TestEmailRequestBody {
  email: string;
}

export type TestEmailRequestParams = EmptyObject;
export type TestEmailRequestQuery = EmptyObject;
