// src/controllers/user.controller.ts
import { Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { userService } from '../services';
import {
  CreateUserRequestBody,
  CreateUserRequestParams,
  CreateUserRequestQuery,
  CreateUserResponseBody,
  DeleteUserRequestBody,
  DeleteUserRequestParams,
  DeleteUserRequestQuery,
  DeleteUserResponseBody,
  GetUserRequestParams,
  GetUserRequestQuery,
  GetUserRequestBody,
  GetUserResponseBody,
  GetUsersParams,
  GetUsersQuery,
  GetUsersRequestBody,
  GetUsersResponseBody,
  UpdateUserRequestBody,
  UpdateUserRequestParams,
  UpdateUserRequestQuery,
  UpdateUserResponseBody
} from '../types/http/user';

// ============================================
// INTERFACE DEFINITION
// ============================================
interface UserController {
  createUser: RequestHandler<
    CreateUserRequestParams,
    CreateUserResponseBody,
    CreateUserRequestBody,
    CreateUserRequestQuery
  >;
  getUsers: RequestHandler<
    GetUsersParams,
    GetUsersResponseBody,
    GetUsersRequestBody,
    GetUsersQuery
  >;
  getUser: RequestHandler<
    GetUserRequestParams,
    GetUserResponseBody,
    GetUserRequestBody,
    GetUserRequestQuery
  >;
  updateUser: RequestHandler<
    UpdateUserRequestParams,
    UpdateUserResponseBody,
    UpdateUserRequestBody,
    UpdateUserRequestQuery
  >;
  deleteUser: RequestHandler<
    DeleteUserRequestParams,
    DeleteUserResponseBody,
    DeleteUserRequestBody,
    DeleteUserRequestQuery
  >;
}

// ============================================
// CONTROLLER IMPLEMENTATION
// ============================================

const createUser = catchAsync<
  CreateUserRequestParams,
  CreateUserResponseBody,
  CreateUserRequestBody,
  CreateUserRequestQuery
>(async (req, res) => {
  const { email, password, name, role } = req.body;
  const userRole = role ?? UserRole.PARTICIPANT;
  const user = await userService.createUser(email, password, name, userRole);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync<
  GetUsersParams,
  GetUsersResponseBody,
  GetUsersRequestBody,
  GetUsersQuery
>(async (req, res) => {
  const filterInput = pick(req.query as Record<string, unknown>, ['name', 'role']);
  const filter: Prisma.UserWhereInput = {};

  if (typeof filterInput.name === 'string' && filterInput.name.trim().length > 0) {
    filter.name = { contains: filterInput.name, mode: 'insensitive' };
  }

  if (typeof filterInput.role === 'string') {
    filter.role = filterInput.role as UserRole;
  }

  const options = pick(req.query as Record<string, unknown>, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync<
  GetUserRequestParams,
  GetUserResponseBody,
  GetUserRequestBody,
  GetUserRequestQuery
>(async (req, res) => {
  const userId = parseId(req.params.userId, 'user ID');
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync<
  UpdateUserRequestParams,
  UpdateUserResponseBody,
  UpdateUserRequestBody,
  UpdateUserRequestQuery
>(async (req, res) => {
  const userId = parseId(req.params.userId, 'user ID');

  const updateData: Prisma.UserUpdateInput = {};
  if (req.body.email !== undefined) updateData.email = req.body.email;
  if (req.body.password !== undefined) updateData.password = req.body.password;
  if (req.body.name !== undefined) updateData.name = req.body.name;

  const user = await userService.updateUserById(userId, updateData);
  res.send(user);
});

const deleteUser = catchAsync<
  DeleteUserRequestParams,
  DeleteUserResponseBody,
  DeleteUserRequestBody,
  DeleteUserRequestQuery
>(async (req, res) => {
  const userId = parseId(req.params.userId, 'user ID');
  await userService.deleteUserById(userId);
  res.status(httpStatus.NO_CONTENT).send();
});

// ============================================
// TYPED EXPORT
// ============================================
const userController: UserController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};

export default userController;
