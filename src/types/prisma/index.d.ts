declare module '.prisma/client' {
  export type UserRole = 'ADMIN' | 'PARTICIPANT';
  export const UserRole: {
    ADMIN: UserRole;
    PARTICIPANT: UserRole;
  };

  export type TokenType = 'ACCESS' | 'REFRESH' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';
  export const TokenType: {
    ACCESS: TokenType;
    REFRESH: TokenType;
    RESET_PASSWORD: TokenType;
    VERIFY_EMAIL: TokenType;
  };

  export type QuestionType = 'TIU' | 'TKP' | 'TWK';
  export const QuestionType: {
    TIU: QuestionType;
    TKP: QuestionType;
    TWK: QuestionType;
  };

  export type ProctoringEventType = 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES';
  export const ProctoringEventType: {
    FACE_NOT_DETECTED: ProctoringEventType;
    MULTIPLE_FACES: ProctoringEventType;
  };

  export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    isEmailVerified: boolean;
  }

  export interface Token {
    id: number;
    token: string | null;
    type: TokenType;
    expires: Date;
    blacklisted: boolean;
    createdAt: Date;
    userId: number;
    tokenHash: string;
  }

  export namespace Prisma {
    export type PrismaClientOptions = Record<string, unknown>;
    export type PrismaPromise<T> = Promise<T>;
    export type UserUpdateInput = Partial<Omit<User, 'id'>>;

    export class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: Record<string, unknown> | null;
      constructor(message: string, code: string, clientVersion: string, meta?: Record<string, unknown> | null);
    }
  }

  export class PrismaClient {
    constructor(options?: Prisma.PrismaClientOptions);
    $disconnect(): Promise<void>;
    $connect(): Promise<void>;
    $transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T>;
    [model: string]: any;
  }

  export default PrismaClient;
}
