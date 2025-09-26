import { EmptyObject, UserRoleString } from './common';

export interface CreateUserRequestBody {
  email: string;
  password: string;
  name: string;
  role: UserRoleString;
}

export type CreateUserRequestParams = EmptyObject;
export type CreateUserRequestQuery = EmptyObject;

export interface GetUsersQuery {
  name?: string;
  role?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}

export type GetUsersParams = EmptyObject;
export type GetUsersRequestBody = EmptyObject;

export interface UserIdParams {
  userId: number;
}

export interface UpdateUserRequestBody {
  email?: string;
  password?: string;
  name?: string;
}

export type DeleteUserRequestBody = EmptyObject;
export type DeleteUserRequestQuery = EmptyObject;

export type GetUserRequestParams = UserIdParams;
export type UpdateUserRequestParams = UserIdParams;
export type DeleteUserRequestParams = UserIdParams;
