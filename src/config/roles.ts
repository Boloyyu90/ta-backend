import { UserRole } from '@prisma/client';

const allRoles = {
  [UserRole.PARTICIPANT]: ['takeExam', 'viewResults', 'getExams', 'allAccess'],
  [UserRole.ADMIN]: [
    'getUsers',
    'manageUsers',
    'manageQuestions',
    'manageExams',
    'takeExam',
    'viewAllResults',
    'viewProctoringEvents',
    'allAccess'
  ]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
