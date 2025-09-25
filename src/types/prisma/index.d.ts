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

  export type JsonPrimitive = string | number | boolean | null;
  export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
  export interface JsonObject {
    [Key: string]: JsonValue;
  }

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

  export interface Exam {
    id: number;
    title: string;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
    durationMinutes: number | null;
    createdBy: number;
    createdAt: Date;
  }

  export interface QuestionBank {
    id: number;
    content: string;
    options: JsonValue;
    correctAnswer: string;
    defaultScore: number;
    questionType: QuestionType;
    createdAt: Date;
  }


  export namespace Prisma {
    export type PrismaClientOptions = Record<string, unknown>;
    export type PrismaPromise<T> = Promise<T>;
    export type JsonPrimitive = import('.prisma/client').JsonPrimitive;
    export type JsonValue = import('.prisma/client').JsonValue;
    export interface JsonObject extends import('.prisma/client').JsonObject {}

    export type StringFilter = {
      contains?: string;
      equals?: string;
      mode?: 'default' | 'insensitive';
    };

    export type UserWhereInput = {
      id?: number;
      email?: string;
      name?: StringFilter;
      role?: UserRole;
      isEmailVerified?: boolean;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
    };

    export type UserUpdateInput = Partial<Omit<User, 'id'>>;

    export type ExamUpdateInput = Partial<
      Pick<Exam, 'title' | 'description' | 'startTime' | 'endTime' | 'durationMinutes'>
    >;

    export type QuestionBankUpdateInput = Partial<
      Pick<QuestionBank, 'content' | 'options' | 'correctAnswer' | 'defaultScore' | 'questionType'>
    >;

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
