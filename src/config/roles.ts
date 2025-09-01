import { UserRole } from '@prisma/client';

const allRoles = {
  [UserRole.PARTICIPANT]: [],
  [UserRole.ADMIN]: ['getUsers', 'manageUsers']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
