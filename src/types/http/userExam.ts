import { EmptyObject } from './common';
import { QuestionOptionKey } from './questionBank';

export interface SubmitAnswerRequestBody {
  userExamId: number;
  examQuestionId: number;
  selectedOption: QuestionOptionKey;
}

export type SubmitAnswerRequestParams = EmptyObject;
export type SubmitAnswerRequestQuery = EmptyObject;

export interface FinishExamParams {
  id: string;
}

export type FinishExamRequestBody = EmptyObject;
export type FinishExamRequestQuery = EmptyObject;

export interface GetUserResultsQuery {
  examId?: number;
}

export type GetUserResultsParams = EmptyObject;
export type GetUserResultsRequestBody = EmptyObject;

export interface GetAllResultsQuery extends GetUserResultsQuery {
  limit?: number;
  page?: number;
}

export type GetAllResultsParams = EmptyObject;
export type GetAllResultsRequestBody = EmptyObject;
