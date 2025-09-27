// src/controllers/userExam.controller.ts
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { userExamService } from '../services';
import {
  FinishExamParams,
  FinishExamRequestBody,
  FinishExamRequestQuery,
  FinishExamResponseBody,
  GetAllResultsParams,
  GetAllResultsQuery,
  GetAllResultsRequestBody,
  GetAllResultsResponseBody,
  GetUserResultsParams,
  GetUserResultsQuery,
  GetUserResultsRequestBody,
  GetUserResultsResponseBody,
  SubmitAnswerRequestBody,
  SubmitAnswerRequestParams,
  SubmitAnswerRequestQuery,
  SubmitAnswerResponseBody
} from '../types/http/userExam';

// ============================================
// INTERFACE DEFINITION
// ============================================
interface UserExamController {
  submitAnswer: RequestHandler<
    SubmitAnswerRequestParams,
    SubmitAnswerResponseBody,
    SubmitAnswerRequestBody,
    SubmitAnswerRequestQuery
  >;
  finishExam: RequestHandler<
    FinishExamParams,
    FinishExamResponseBody,
    FinishExamRequestBody,
    FinishExamRequestQuery
  >;
  getUserResults: RequestHandler<
    GetUserResultsParams,
    GetUserResultsResponseBody,
    GetUserResultsRequestBody,
    GetUserResultsQuery
  >;
  getAllResults: RequestHandler<
    GetAllResultsParams,
    GetAllResultsResponseBody,
    GetAllResultsRequestBody,
    GetAllResultsQuery
  >;
}

// ============================================
// CONTROLLER IMPLEMENTATION
// ============================================

const submitAnswer = catchAsync<
  SubmitAnswerRequestParams,
  SubmitAnswerResponseBody,
  SubmitAnswerRequestBody,
  SubmitAnswerRequestQuery
>(async (req, res) => {
  const { userExamId, examQuestionId, selectedOption } = req.body;
  const { id: actorUserId } = req.user as { id: number };

  const answer = await userExamService.submitAnswer(
    actorUserId,
    userExamId,
    examQuestionId,
    selectedOption
  );

  res.send(answer);
});

const finishExam = catchAsync<
  FinishExamParams,
  FinishExamResponseBody,
  FinishExamRequestBody,
  FinishExamRequestQuery
>(async (req, res) => {
  const userExamId = parseId(req.params.id, 'user exam ID');
  const { id: actorUserId } = req.user as { id: number };

  const userExam = await userExamService.finishExam(actorUserId, userExamId);
  res.send(userExam);
});

const getUserResults = catchAsync<
  GetUserResultsParams,
  GetUserResultsResponseBody,
  GetUserResultsRequestBody,
  GetUserResultsQuery
>(async (req, res) => {
  const { id: userId } = req.user as { id: number };
  const results = await userExamService.getUserExamResults(userId, req.query.examId);
  res.send(results);
});

const getAllResults = catchAsync<
  GetAllResultsParams,
  GetAllResultsResponseBody,
  GetAllResultsRequestBody,
  GetAllResultsQuery
>(async (req, res) => {
  const results = await userExamService.getAllExamResults(req.query.examId, {
    limit: req.query.limit,
    page: req.query.page
  });
  res.send(results);
});

// ============================================
// TYPED EXPORT
// ============================================
const userExamController: UserExamController = {
  submitAnswer,
  finishExam,
  getUserResults,
  getAllResults
};

export default userExamController;
