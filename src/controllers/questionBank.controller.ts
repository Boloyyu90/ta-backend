import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import { questionBankService } from '../services';

const createQuestion = catchAsync(async (req: any, res: any) => {
  const question = await questionBankService.createQuestion(req.body);
  res.status(httpStatus.CREATED).send(question);
});

const getQuestions = catchAsync(async (req: any, res: any) => {
  const filter = {
    questionType: req.query.questionType,
    limit: req.query.limit ? parseInt(req.query.limit) : undefined,
    page: req.query.page ? parseInt(req.query.page) : undefined
  };
  const result = await questionBankService.getQuestions(filter);
  res.send(result);
});

const getQuestion = catchAsync(async (req: any, res: any) => {
  const question = await questionBankService.getQuestionById(parseInt(req.params.id));
  res.send(question);
});

const updateQuestion = catchAsync(async (req: any, res: any) => {
  const question = await questionBankService.updateQuestion(parseInt(req.params.id), req.body);
  res.send(question);
});

const deleteQuestion = catchAsync(async (req: any, res: any) => {
  await questionBankService.deleteQuestion(parseInt(req.params.id));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
};