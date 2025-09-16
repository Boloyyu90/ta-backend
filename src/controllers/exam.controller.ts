import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { examService } from '../services';
import { error } from 'console';

const createExam = catchAsync(async (req: any, res: any) => {
  const examData = {
    ...req.body,
    createdBy: req.user.id
  };
  const exam = await examService.createExam(examData);
  res.status(httpStatus.CREATED).send(exam);
});

const getExams = catchAsync(async (req: any, res: any) => {
  const filter = {
    limit: req.query.limit ? parseInt(req.query.limit) : undefined,
    page: req.query.page ? parseInt(req.query.page) : undefined,
    search: req.query.search ?? ""
  };
  const result = await examService.getExams(filter);
  res.send(result);
});

const getExam = catchAsync(async (req: any, res: any) => {
  const includeQuestions = req.query.include === 'questions';
  const exam = await examService.getExamById(parseInt(req.params.id), includeQuestions);
  res.send(exam);
});

const updateExam = catchAsync(async (req: any, res: any) => {
  const exam = await examService.updateExam(parseInt(req.params.id), req.body);
  res.send(exam);
});

const startExam = catchAsync(async (req: any, res: any) => {
  const userExam = await examService.startExam(parseInt(req.params.id), req.user.id);
  res.send(userExam);
});

export default {
  createExam,
  getExams,
  getExam,
  updateExam,
  startExam
};
