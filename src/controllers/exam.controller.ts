// src/controllers/exam.controller.ts
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { examService } from '../services';
import {
  CreateExamRequestBody,
  CreateExamRequestParams,
  CreateExamRequestQuery,
  CreateExamResponseBody,
  GetExamParams,
  GetExamQuery,
  GetExamRequestBody,
  GetExamResponseBody,
  GetExamsParams,
  GetExamsQuery,
  GetExamsRequestBody,
  GetExamsResponseBody,
  StartExamParams,
  StartExamRequestBody,
  StartExamRequestQuery,
  StartExamResponseBody,
  UpdateExamRequestBody,
  UpdateExamRequestParams,
  UpdateExamRequestQuery,
  UpdateExamResponseBody
} from '../types/http/exam';

// ============================================
// INTERFACE DEFINITION
// ============================================
interface ExamController {
  createExam: RequestHandler<
    CreateExamRequestParams,
    CreateExamResponseBody,
    CreateExamRequestBody,
    CreateExamRequestQuery
  >;
  getExams: RequestHandler<
    GetExamsParams,
    GetExamsResponseBody,
    GetExamsRequestBody,
    GetExamsQuery
  >;
  getExam: RequestHandler<
    GetExamParams,
    GetExamResponseBody,
    GetExamRequestBody,
    GetExamQuery
  >;
  updateExam: RequestHandler<
    UpdateExamRequestParams,
    UpdateExamResponseBody,
    UpdateExamRequestBody,
    UpdateExamRequestQuery
  >;
  startExam: RequestHandler<
    StartExamParams,
    StartExamResponseBody,
    StartExamRequestBody,
    StartExamRequestQuery
  >;
}

// ============================================
// CONTROLLER IMPLEMENTATION
// ============================================

const createExam = catchAsync<
  CreateExamRequestParams,
  CreateExamResponseBody,
  CreateExamRequestBody,
  CreateExamRequestQuery
>(async (req, res) => {
  const { id: userId } = req.user as { id: number };
  const examData = {
    ...req.body,
    createdBy: userId
  };
  const exam = await examService.createExam(examData);
  res.status(httpStatus.CREATED).send(exam);
});

const getExams = catchAsync<
  GetExamsParams,
  GetExamsResponseBody,
  GetExamsRequestBody,
  GetExamsQuery
>(async (req, res) => {
  const filter = {
    limit: req.query.limit,
    page: req.query.page,
    search: req.query.search ?? ''
  };
  const result = await examService.getExams(filter);
  res.send(result);
});

const getExam = catchAsync<
  GetExamParams,
  GetExamResponseBody,
  GetExamRequestBody,
  GetExamQuery
>(async (req, res) => {
  const examId = parseId(req.params.id, 'exam ID');
  const includeQuestions = req.query.include === 'questions';
  const userRole = (req.user as { role: string })?.role;

  const exam = await examService.getExamById(
    examId,
    includeQuestions,
    userRole as 'ADMIN' | 'PARTICIPANT'
  );

  res.send(exam);
});

const updateExam = catchAsync<
  UpdateExamRequestParams,
  UpdateExamResponseBody,
  UpdateExamRequestBody,
  UpdateExamRequestQuery
>(async (req, res) => {
  const examId = parseId(req.params.id, 'exam ID');

  const updateData: Prisma.ExamUpdateInput = {};
  if (req.body.title !== undefined) updateData.title = req.body.title;
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.startTime !== undefined) updateData.startTime = req.body.startTime;
  if (req.body.endTime !== undefined) updateData.endTime = req.body.endTime;
  if (req.body.durationMinutes !== undefined) updateData.durationMinutes = req.body.durationMinutes;

  const exam = await examService.updateExam(examId, updateData);
  res.send(exam);
});

const startExam = catchAsync<
  StartExamParams,
  StartExamResponseBody,
  StartExamRequestBody,
  StartExamRequestQuery
>(async (req, res) => {
  const examId = parseId(req.params.id, 'exam ID');
  const { id: userId } = req.user as { id: number };
  const userExam = await examService.startExam(examId, userId);
  res.send(userExam);
});

// ============================================
// TYPED EXPORT
// ============================================
const examController: ExamController = {
  createExam,
  getExams,
  getExam,
  updateExam,
  startExam
};

export default examController;
