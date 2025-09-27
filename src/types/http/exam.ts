import { EmptyObject } from './common';

// ============================================
// SHARED TYPES
// ============================================
export interface ExamQuestionInput {
  questionId: number;
  orderNumber?: number;
}

// ============================================
// CREATE EXAM
// ============================================
export interface CreateExamRequestBody {
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  durationMinutes?: number;
  questions?: ExamQuestionInput[];
}

export type CreateExamRequestParams = EmptyObject;
export type CreateExamRequestQuery = EmptyObject;
export type CreateExamResponseBody = {
  id: number;
  title: string;
  description: string | null;
  startTime: Date | null;
  endTime: Date | null;
  durationMinutes: number | null;
  createdBy: number;
  createdAt: Date;
};

// ============================================
// GET EXAMS (LIST)
// ============================================
export interface GetExamsQuery {
  title?: string;
  limit?: number;
  page?: number;
  search?: string;
}

export type GetExamsParams = EmptyObject;
export type GetExamsRequestBody = EmptyObject;
export type GetExamsResponseBody = {
  exams: Array<{
    id: number;
    title: string;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
    durationMinutes: number | null;
    createdBy: number;
    createdAt: Date;
    creator: {
      id: number;
      name: string;
      email: string;
    };
    _count: {
      examQuestions: number;
      userExams: number;
    };
  }>;
  total: number;
};

// ============================================
// GET EXAM (SINGLE)
// ============================================
export interface GetExamParams {
  id: string; // ✅ Always string from Express
}

export interface GetExamQuery {
  include?: 'questions';
}

export type GetExamRequestBody = EmptyObject;
export type GetExamResponseBody = {
  id: number;
  title: string;
  description: string | null;
  startTime: Date | null;
  endTime: Date | null;
  durationMinutes: number | null;
  createdBy: number;
  createdAt: Date;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  _count: {
    examQuestions: number;
    userExams: number;
  };
  examQuestions?: Array<{
    id: number;
    examId: number;
    questionId: number;
    orderNumber: number | null;
    question: {
      id: number;
      content: string;
      options: Record<string, string>;
      questionType: string;
      defaultScore: number;
      correctAnswer?: string; // Only for ADMIN
    };
  }>;
};

// ============================================
// UPDATE EXAM
// ============================================
export interface UpdateExamRequestParams {
  id: string; // ✅ Always string from Express
}

export interface UpdateExamRequestBody {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  durationMinutes?: number;
}

export type UpdateExamRequestQuery = EmptyObject;
export type UpdateExamResponseBody = {
  id: number;
  title: string;
  description: string | null;
  startTime: Date | null;
  endTime: Date | null;
  durationMinutes: number | null;
  createdBy: number;
  createdAt: Date;
};

// ============================================
// START EXAM
// ============================================
export interface StartExamParams {
  id: string; // ✅ Always string from Express
}

export type StartExamRequestBody = EmptyObject;
export type StartExamRequestQuery = EmptyObject;
export type StartExamResponseBody = {
  id: number;
  userId: number;
  examId: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  totalScore: number | null;
  status: string;
  createdAt: Date;
};
