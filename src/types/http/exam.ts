import { EmptyObject } from './common';

export interface ExamQuestionInput {
  questionId: number;
  orderNumber?: number;
  scoreOverride?: number;
}

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

export interface GetExamsQuery {
  title?: string;
  limit?: number;
  page?: number;
  search?: string;
}

export type GetExamsParams = EmptyObject;
export type GetExamsRequestBody = EmptyObject;

export interface GetExamParams {
  id: number;
}

export interface GetExamQuery {
  include?: 'questions';
}

export interface UpdateExamRequestBody {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  durationMinutes?: number;
}

export type UpdateExamRequestParams = GetExamParams;
export type UpdateExamRequestQuery = EmptyObject;

export type StartExamParams = GetExamParams;
export type StartExamRequestBody = EmptyObject;
export type StartExamRequestQuery = EmptyObject;
