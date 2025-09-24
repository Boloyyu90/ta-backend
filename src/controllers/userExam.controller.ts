import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { userExamService } from '../services';
import {
  FinishExamParams,
  FinishExamRequestBody,
  FinishExamRequestQuery,
  GetAllResultsParams,
  GetAllResultsQuery,
  GetAllResultsRequestBody,
  GetUserResultsParams,
  GetUserResultsQuery,
  GetUserResultsRequestBody,
  SubmitAnswerRequestBody,
  SubmitAnswerRequestParams,
  SubmitAnswerRequestQuery
} from '../types/http/userExam';

const submitAnswer = catchAsync(
  async (
    req: Request<
      SubmitAnswerRequestParams,
      unknown,
      SubmitAnswerRequestBody,
      SubmitAnswerRequestQuery
    >,
    res: Response<unknown>
  ) => {
    const { userExamId, examQuestionId, selectedOption } = req.body;
    const answer = await userExamService.submitAnswer(userExamId, examQuestionId, selectedOption);
    res.send(answer);
  }
);

const finishExam = catchAsync(
  async (
    req: Request<FinishExamParams, unknown, FinishExamRequestBody, FinishExamRequestQuery>,
    res: Response<unknown>
  ) => {
    const userExam = await userExamService.finishExam(req.params.id);
    res.send(userExam);
  }
);

const getUserResults = catchAsync(
  async (
    req: Request<GetUserResultsParams, unknown, GetUserResultsRequestBody, GetUserResultsQuery>,
    res: Response<unknown>
  ) => {
    const { id: userId } = req.user as { id: number };
    const results = await userExamService.getUserExamResults(userId, req.query.examId);
    res.send(results);
  }
);

const getAllResults = catchAsync(
  async (
    req: Request<GetAllResultsParams, unknown, GetAllResultsRequestBody, GetAllResultsQuery>,
    res: Response<unknown>
  ) => {
    const results = await userExamService.getAllExamResults(req.query.examId, {
      limit: req.query.limit,
      page: req.query.page
    });
    res.send(results);
  }
);

export default {
  submitAnswer,
  finishExam,
  getUserResults,
  getAllResults
};
