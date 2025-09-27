import { EmptyObject, UserRoleString } from './common';

// ============================================
// CREATE USER
// ============================================
export interface CreateUserRequestBody {
  email: string;
  password: string;
  name: string;
  role: UserRoleString;
}

export type CreateUserRequestParams = EmptyObject;
export type CreateUserRequestQuery = EmptyObject;
export type CreateUserResponseBody = {
  id: number;
  email: string;
  name: string;
  role: UserRoleString;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// GET USERS (LIST)
// ============================================
export interface GetUsersQuery {
  name?: string;
  role?: UserRoleString;
  sortBy?: string;
  limit?: number;
  page?: number;
}

export type GetUsersParams = EmptyObject;
export type GetUsersRequestBody = EmptyObject;
export type GetUsersResponseBody = {
  id: number;
  email: string;
  name: string;
  role: UserRoleString;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}[];

// ============================================
// GET USER (SINGLE)
// ============================================
export interface GetUserRequestParams {
  userId: string; // ✅ Always string from Express
}

export type GetUserRequestQuery = EmptyObject;
export type GetUserRequestBody = EmptyObject;
export type GetUserResponseBody = {
  id: number;
  email: string;
  name: string;
  role: UserRoleString;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// UPDATE USER
// ============================================
export interface UpdateUserRequestParams {
  userId: string; // ✅ Always string from Express
}

export interface UpdateUserRequestBody {
  email?: string;
  password?: string;
  name?: string;
}

export type UpdateUserRequestQuery = EmptyObject;
export type UpdateUserResponseBody = {
  id: number;
  email: string;
  name: string;
  role: UserRoleString;
};

// ============================================
// DELETE USER
// ============================================
export interface DeleteUserRequestParams {
  userId: string; // ✅ Always string from Express
}

export type DeleteUserRequestBody = EmptyObject;
export type DeleteUserRequestQuery = EmptyObject;
export type DeleteUserResponseBody = void; // ✅ NO_CONTENT
