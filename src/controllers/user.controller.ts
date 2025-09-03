import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';

const createUser = catchAsync(async (req: any, res: any) => {
  const { email, password, name, role } = req.body;
  const user = await userService.createUser(email, password, name, role);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req: any, res: any) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req: any, res: any) => {
  const user = await userService.getUserById(parseInt(req.params.userId));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req: any, res: any) => {
  const user = await userService.updateUserById(parseInt(req.params.userId), req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: any, res: any) => {
  await userService.deleteUserById(parseInt(req.params.userId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
