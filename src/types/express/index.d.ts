import type { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      role: UserRole;
    }

    interface Request {
      user?: User;
    }
  }
}

export type AuthUser = Express.User;
