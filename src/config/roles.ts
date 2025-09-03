import { UserRole } from '@prisma/client';

const allRoles = {
  [UserRole.PARTICIPANT]: ['takeExam', 'viewResults'],
  [UserRole.ADMIN]: [
    'getUsers', 
    'manageUsers',
    'manageQuestions',
    'manageExams',
    'viewAllResults',
    'viewProctoringEvents'
  ]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));