import httpStatus from 'http-status';
import { Request, Response } from 'express';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
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
    const user = await userService.createUser(email, password, name, role);
    res.status(httpStatus.CREATED).send(user);
  }
);

const getUsers = catchAsync(
  async (
    req: Request<GetUsersParams, unknown, GetUsersRequestBody, GetUsersQuery>,
    res: Response<unknown>
  ) => {
    const filter = pick(req.query as Record<string, unknown>, ['name', 'role']);
    const options = pick(req.query as Record<string, unknown>, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
  }
);

const getUser = catchAsync(
  async (
    req: Request<GetUserRequestParams, unknown, unknown, unknown>,
    res: Response<unknown>
  ) => {
    const user = await userService.getUserById(req.params.userId);
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
    const user = await userService.updateUserById(req.params.userId, req.body as any);
    res.send(user);
  }
);

const deleteUser = catchAsync(
  async (
    req: Request<DeleteUserRequestParams, unknown, DeleteUserRequestBody, DeleteUserRequestQuery>,
    res: Response<unknown>
  ) => {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
