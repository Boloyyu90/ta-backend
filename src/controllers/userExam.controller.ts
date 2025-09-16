import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { userExamService } from '../services';

const submitAnswer = catchAsync(async (req: any, res: any) => {
  const { userExamId, examQuestionId, selectedOption } = req.body;
  const answer = await userExamService.submitAnswer(userExamId, examQuestionId, selectedOption);
  res.send(answer);
});

const finishExam = catchAsync(async (req: any, res: any) => {
  const userExam = await userExamService.finishExam(parseInt(req.params.id));
  res.send(userExam);
});

const getUserResults = catchAsync(async (req: any, res: any) => {
  const userId = req.user.id;
  const examId = req.query.examId ? parseInt(req.query.examId) : undefined;
  const results = await userExamService.getUserExamResults(userId, examId);
  res.send(results);
});

const getAllResults = catchAsync(async (req: any, res: any) => {
  const examId = req.query.examId ? parseInt(req.query.examId) : undefined;
  const results = await userExamService.getAllExamResults(examId);
  res.send(results);
});

export default {
  submitAnswer,
  finishExam,
  getUserResults,
  getAllResults
};