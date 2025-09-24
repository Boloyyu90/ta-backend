import { EmptyObject } from './common';

export type QuestionOptionKey = 'A' | 'B' | 'C' | 'D' | 'E';
export type QuestionTypeString = 'TIU' | 'TKP' | 'TWK';

export interface CreateQuestionRequestBody {
  content: string;
  options: Record<string, string>;
  correctAnswer: QuestionOptionKey;
  defaultScore?: number;
  questionType: QuestionTypeString;
}

export type CreateQuestionRequestParams = EmptyObject;
export type CreateQuestionRequestQuery = EmptyObject;

export interface GetQuestionsQuery {
  questionType?: QuestionTypeString;
  limit?: number;
  page?: number;
}

export type GetQuestionsParams = EmptyObject;
export type GetQuestionsRequestBody = EmptyObject;

export interface QuestionIdParams {
  id: number;
}

export interface UpdateQuestionRequestBody {
  content?: string;
  options?: Record<string, string>;
  correctAnswer?: QuestionOptionKey;
  defaultScore?: number;
  questionType?: QuestionTypeString;
}

export type DeleteQuestionRequestParams = QuestionIdParams;
export type DeleteQuestionRequestBody = EmptyObject;
export type DeleteQuestionRequestQuery = EmptyObject;
