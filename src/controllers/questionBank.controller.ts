// src/controllers/questionBank.controller.ts
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { questionBankService } from '../services';
import {
  CreateQuestionRequestBody,
  CreateQuestionRequestParams,
  CreateQuestionRequestQuery,
  CreateQuestionResponseBody,
  DeleteQuestionRequestBody,
  DeleteQuestionRequestParams,
  DeleteQuestionRequestQuery,
  DeleteQuestionResponseBody,
  GetQuestionParams,
  GetQuestionQuery,
  GetQuestionRequestBody,
  GetQuestionResponseBody,
  GetQuestionsParams,
  GetQuestionsQuery,
  GetQuestionsRequestBody,
  GetQuestionsResponseBody,
  UpdateQuestionRequestBody,
  UpdateQuestionRequestParams,
  UpdateQuestionRequestQuery,
  UpdateQuestionResponseBody
} from '../types/http/questionBank';

// ============================================
// INTERFACE DEFINITION
// ============================================
interface QuestionBankController {
  createQuestion: RequestHandler<
    CreateQuestionRequestParams,
    CreateQuestionResponseBody,
    CreateQuestionRequestBody,
    CreateQuestionRequestQuery
  >;
  getQuestions: RequestHandler<
    GetQuestionsParams,
    GetQuestionsResponseBody,
    GetQuestionsRequestBody,
    GetQuestionsQuery
  >;
  getQuestion: RequestHandler<
    GetQuestionParams,
    GetQuestionResponseBody,
    GetQuestionRequestBody,
    GetQuestionQuery
  >;
  updateQuestion: RequestHandler<
    UpdateQuestionRequestParams,
    UpdateQuestionResponseBody,
    UpdateQuestionRequestBody,
    UpdateQuestionRequestQuery
  >;
  deleteQuestion: RequestHandler<
    DeleteQuestionRequestParams,
    DeleteQuestionResponseBody,
    DeleteQuestionRequestBody,
    DeleteQuestionRequestQuery
  >;
}

// ============================================
// CONTROLLER IMPLEMENTATION
// ============================================

const createQuestion = catchAsync<
  CreateQuestionRequestParams,
  CreateQuestionResponseBody,
  CreateQuestionRequestBody,
  CreateQuestionRequestQuery
>(async (req, res) => {
  const question = await questionBankService.createQuestion(req.body);
  res.status(httpStatus.CREATED).send(question);
});

const getQuestions = catchAsync<
  GetQuestionsParams,
  GetQuestionsResponseBody,
  GetQuestionsRequestBody,
  GetQuestionsQuery
>(async (req, res) => {
  const filter = {
    questionType: req.query.questionType,
    limit: req.query.limit,
    page: req.query.page
  };
  const result = await questionBankService.getQuestions(filter);
  res.send(result);
});

const getQuestion = catchAsync<
  GetQuestionParams,
  GetQuestionResponseBody,
  GetQuestionRequestBody,
  GetQuestionQuery
>(async (req, res) => {
  const questionId = parseId(req.params.id, 'question ID');
  const question = await questionBankService.getQuestionById(questionId);
  res.send(question);
});

const updateQuestion = catchAsync<
  UpdateQuestionRequestParams,
  UpdateQuestionResponseBody,
  UpdateQuestionRequestBody,
  UpdateQuestionRequestQuery
>(async (req, res) => {
  const questionId = parseId(req.params.id, 'question ID');

  const updateData: Prisma.QuestionBankUpdateInput = {};
  if (req.body.content !== undefined) updateData.content = req.body.content;
  if (req.body.options !== undefined) updateData.options = req.body.options;
  if (req.body.correctAnswer !== undefined) updateData.correctAnswer = req.body.correctAnswer;
  if (req.body.defaultScore !== undefined) updateData.defaultScore = req.body.defaultScore;
  if (req.body.questionType !== undefined) updateData.questionType = req.body.questionType;

  const question = await questionBankService.updateQuestion(questionId, updateData);
  res.send(question);
});

const deleteQuestion = catchAsync<
  DeleteQuestionRequestParams,
  DeleteQuestionResponseBody,
  DeleteQuestionRequestBody,
  DeleteQuestionRequestQuery
>(async (req, res) => {
  const questionId = parseId(req.params.id, 'question ID');
  await questionBankService.deleteQuestion(questionId);
  res.status(httpStatus.NO_CONTENT).send();
});

// ============================================
// TYPED EXPORT
// ============================================
const questionBankController: QuestionBankController = {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
};

export default questionBankController;
