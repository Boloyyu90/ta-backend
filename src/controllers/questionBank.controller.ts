import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { questionBankService } from '../services';
import {
  CreateQuestionRequestBody,
  CreateQuestionRequestParams,
  CreateQuestionRequestQuery,
  DeleteQuestionRequestBody,
  DeleteQuestionRequestParams,
  DeleteQuestionRequestQuery,
  GetQuestionsParams,
  GetQuestionsQuery,
  GetQuestionsRequestBody,
  QuestionIdParams,
  UpdateQuestionRequestBody
} from '../types/http/questionBank';

const createQuestion = catchAsync(
  async (
    req: Request<
      CreateQuestionRequestParams,
      unknown,
      CreateQuestionRequestBody,
      CreateQuestionRequestQuery
    >,
    res: Response<unknown>
  ) => {
    const question = await questionBankService.createQuestion(req.body);
    res.status(httpStatus.CREATED).send(question);
  }
);

const getQuestions = catchAsync(
  async (
    req: Request<GetQuestionsParams, unknown, GetQuestionsRequestBody, GetQuestionsQuery>,
    res: Response<unknown>
  ) => {
    const filter = {
      questionType: req.query.questionType,
      limit: req.query.limit,
      page: req.query.page
    };
    const result = await questionBankService.getQuestions(filter);
    res.send(result);
  }
);

const getQuestion = catchAsync(
  async (
    req: Request<QuestionIdParams, unknown, unknown, unknown>,
    res: Response<unknown>
  ) => {
    const question = await questionBankService.getQuestionById(req.params.id);
    res.send(question);
  }
);

const updateQuestion = catchAsync(
  async (
    req: Request<QuestionIdParams, unknown, UpdateQuestionRequestBody, unknown>,
    res: Response<unknown>
  ) => {
    const updateData: Prisma.QuestionBankUpdateInput = {};

    if (req.body.content !== undefined) {
      updateData.content = req.body.content;
    }
    if (req.body.options !== undefined) {
      updateData.options = req.body.options;
    }
    if (req.body.correctAnswer !== undefined) {
      updateData.correctAnswer = req.body.correctAnswer;
    }
    if (req.body.defaultScore !== undefined) {
      updateData.defaultScore = req.body.defaultScore;
    }
    if (req.body.questionType !== undefined) {
      updateData.questionType = req.body.questionType;
    }

    const question = await questionBankService.updateQuestion(req.params.id, updateData);
    res.send(question);
  }
);

const deleteQuestion = catchAsync(
  async (
    req: Request<
      DeleteQuestionRequestParams,
      unknown,
      DeleteQuestionRequestBody,
      DeleteQuestionRequestQuery
    >,
    res: Response<unknown>
  ) => {
    await questionBankService.deleteQuestion(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

export default {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
};
