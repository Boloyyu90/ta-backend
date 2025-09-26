import { Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { userService } from '../services';
import {
  CreateUserRequestBody,
  CreateUserRequestParams,
  CreateUserRequestQuery,
  DeleteUserRequestBody,
  DeleteUserRequestParams,
  DeleteUserRequestQuery,
  GetUserRequestParams,
  GetUsersParams,
  GetUsersQuery,
  GetUsersRequestBody,
  UpdateUserRequestBody,
  UpdateUserRequestParams
} from '../types/http/user';

const createUser = catchAsync(
  async (
    req: Request<CreateUserRequestParams, unknown, CreateUserRequestBody, CreateUserRequestQuery>,
    res: Response<unknown>
  ) => {
    const { email, password, name, role } = req.body;
    const userRole = role ?? UserRole.PARTICIPANT;
    const user = await userService.createUser(email, password, name, userRole);
    res.status(httpStatus.CREATED).send(user);
  }
);

const getUsers = catchAsync(
  async (
    req: Request<GetUsersParams, unknown, GetUsersRequestBody, GetUsersQuery>,
    res: Response<unknown>
  ) => {
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
  }
);

const getUser = catchAsync(
  async (req: Request<GetUserRequestParams, unknown, unknown, unknown>, res: Response<unknown>) => {
    const userId = parseId(req.params.userId, 'user ID');
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
);

const updateUser = catchAsync(
  async (
    req: Request<UpdateUserRequestParams, unknown, UpdateUserRequestBody, unknown>,
    res: Response<unknown>
  ) => {
    const userId = parseId(req.params.userId, 'user ID');

    const updateData: Prisma.UserUpdateInput = {};
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.password !== undefined) updateData.password = req.body.password;
    if (req.body.name !== undefined) updateData.name = req.body.name;

    const user = await userService.updateUserById(userId, updateData);
    res.send(user);
  }
);

const deleteUser = catchAsync(
  async (
    req: Request<DeleteUserRequestParams, unknown, DeleteUserRequestBody, DeleteUserRequestQuery>,
    res: Response<unknown>
  ) => {
    const userId = parseId(req.params.userId, 'user ID');
    await userService.deleteUserById(userId);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} as any;
