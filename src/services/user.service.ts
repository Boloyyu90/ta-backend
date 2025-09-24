import { Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

const DEFAULT_USER_SELECT = [
  'id',
  'email',
  'name',
  'role',
  'isEmailVerified',
  'createdAt',
  'updatedAt'
] as const;
/**
 * Create user
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {string} role
 * @returns {Promise<User>}
 */
const createUser = async (
  email: string,
  password: string,
  name: string = '',
  role: string = 'PARTICIPANT'
): Promise<User> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.user.create({
    data: {
      email,
      password: await encryptPassword(password),
      name,
      role: role as any
    }
  });
};

/**
 * Query semua users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: any,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'email',
    'name',
    'role',
    'isEmailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return users as Pick<User, Key>[];
};

/**
 * Get user berdasarkan id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key>>}
 */
const getUserById = async <Key extends keyof User>(
  id: number,
  keys: Key[] = DEFAULT_USER_SELECT as unknown as Key[]
): Promise<Pick<User, Key>> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user as Pick<User, Key>;
};


/**
 * Get user berdasarkan email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = DEFAULT_USER_SELECT as unknown as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

const getUserByEmailOrThrow = async <Key extends keyof User>(
  email: string,
  keys: Key[] = DEFAULT_USER_SELECT as unknown as Key[],
  errorStatus: number = httpStatus.NOT_FOUND,
  errorMessage = 'User not found'
): Promise<Pick<User, Key>> => {
  const user = await getUserByEmail<Key>(email, keys);

  if (!user) {
    throw new ApiError(errorStatus, errorMessage);
  }

  return user;
};


/**
 * Update user berdasarkan id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<Pick<User, Key>>}
 */
const updateUserById = async <Key extends keyof User>(
  userId: number,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<User, Key>> => {
  const user = await getUserById(userId, ['id', 'email', 'name']);
  if (updateBody.email && (await getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.password) {
    updateBody.password = await encryptPassword(updateBody.password as string);
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key>;
};

/**
 * Delete user berdasarkan id
 * @param {number} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: number): Promise<User> => {
  const user = await getUserById(userId);
  await prisma.user.delete({ where: { id: user.id } });
  return user as User;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByEmailOrThrow,
  updateUserById,
  deleteUserById
};
