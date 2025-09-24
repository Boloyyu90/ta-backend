import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { examService } from '../services';
import {
  CreateExamRequestBody,
  CreateExamRequestParams,
  CreateExamRequestQuery,
  GetExamParams,
  GetExamQuery,
  GetExamsParams,
  GetExamsQuery,
  GetExamsRequestBody,
  StartExamParams,
  StartExamRequestBody,
  StartExamRequestQuery,
  UpdateExamRequestBody,
  UpdateExamRequestParams,
  UpdateExamRequestQuery
} from '../types/http/exam';

const createExam = catchAsync(
  async (
    req: Request<CreateExamRequestParams, unknown, CreateExamRequestBody, CreateExamRequestQuery>,
    res: Response<unknown>
  ) => {
    const { id: userId } = req.user as { id: number };
    const examData = {
      ...req.body,
      createdBy: userId
    };
    const exam = await examService.createExam(examData);
    res.status(httpStatus.CREATED).send(exam);
  }
);

const getExams = catchAsync(
  async (
    req: Request<GetExamsParams, unknown, GetExamsRequestBody, GetExamsQuery>,
    res: Response<unknown>
  ) => {
    const filter = {
      limit: req.query.limit,
      page: req.query.page,
      search: req.query.search ?? ''
    };
    const result = await examService.getExams(filter);
    res.send(result);
  }
);

const getExam = catchAsync(
  async (
    req: Request<GetExamParams, unknown, unknown, GetExamQuery>,
    res: Response<unknown>
  ) => {
    const includeQuestions = req.query.include === 'questions';
    const exam = await examService.getExamById(req.params.id, includeQuestions);
    res.send(exam);
  }
);

const updateExam = catchAsync(
  async (
    req: Request<UpdateExamRequestParams, unknown, UpdateExamRequestBody, UpdateExamRequestQuery>,
    res: Response<unknown>
  ) => {
    const exam = await examService.updateExam(req.params.id, req.body);
    res.send(exam);
  }
);

const startExam = catchAsync(
  async (
    req: Request<StartExamParams, unknown, StartExamRequestBody, StartExamRequestQuery>,
    res: Response<unknown>
  ) => {
    const { id: userId } = req.user as { id: number };
    const userExam = await examService.startExam(req.params.id, userId);
    res.send(userExam);
  }
);

export default {
  createExam,
  getExams,
  getExam,
  updateExam,
  startExam
};
