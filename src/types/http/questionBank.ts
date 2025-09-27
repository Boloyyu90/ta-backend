import { EmptyObject } from './common';

export type QuestionOptionKey = 'A' | 'B' | 'C' | 'D' | 'E';
export type QuestionTypeString = 'TIU' | 'TKP' | 'TWK';

// ============================================
// CREATE QUESTION
// ============================================
export interface CreateQuestionRequestBody {
  content: string;
  options: Record<QuestionOptionKey, string>;
  correctAnswer: QuestionOptionKey;
  defaultScore?: number;
  questionType: QuestionTypeString;
}

export type CreateQuestionRequestParams = EmptyObject;
export type CreateQuestionRequestQuery = EmptyObject;
export type CreateQuestionResponseBody = {
  id: number;
  content: string;
  options: Record<QuestionOptionKey, string>;
  correctAnswer: QuestionOptionKey;
  defaultScore: number;
  questionType: QuestionTypeString;
  createdAt: Date;
};

// ============================================
// GET QUESTIONS (LIST)
// ============================================
export interface GetQuestionsQuery {
  questionType?: QuestionTypeString;
  limit?: number;
  page?: number;
}

export type GetQuestionsParams = EmptyObject;
export type GetQuestionsRequestBody = EmptyObject;
export type GetQuestionsResponseBody = {
  questions: Array<{
    id: number;
    content: string;
    options: Record<QuestionOptionKey, string>;
    correctAnswer: QuestionOptionKey;
    defaultScore: number;
    questionType: QuestionTypeString;
    createdAt: Date;
  }>;
  total: number;
};

// ============================================
// GET QUESTION (SINGLE)
// ============================================
export interface GetQuestionParams {
  id: string; // ✅ Always string from Express
}

export type GetQuestionQuery = EmptyObject;
export type GetQuestionRequestBody = EmptyObject;
export type GetQuestionResponseBody = {
  id: number;
  content: string;
  options: Record<QuestionOptionKey, string>;
  correctAnswer: QuestionOptionKey;
  defaultScore: number;
  questionType: QuestionTypeString;
  createdAt: Date;
};

// ============================================
// UPDATE QUESTION
// ============================================
export interface UpdateQuestionRequestParams {
  id: string; // ✅ Always string from Express
}

export interface UpdateQuestionRequestBody {
  content?: string;
  options?: Record<QuestionOptionKey, string>;
  correctAnswer?: QuestionOptionKey;
  defaultScore?: number;
  questionType?: QuestionTypeString;
}

export type UpdateQuestionRequestQuery = EmptyObject;
export type UpdateQuestionResponseBody = {
  id: number;
  content: string;
  options: Record<QuestionOptionKey, string>;
  correctAnswer: QuestionOptionKey;
  defaultScore: number;
  questionType: QuestionTypeString;
  createdAt: Date;
};

// ============================================
// DELETE QUESTION
// ============================================
export interface DeleteQuestionRequestParams {
  id: string; // ✅ Always string from Express
}

export type DeleteQuestionRequestBody = EmptyObject;
export type DeleteQuestionRequestQuery = EmptyObject;
export type DeleteQuestionResponseBody = void; // ✅ NO_CONTENT
