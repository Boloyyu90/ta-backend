import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { proctoringService } from '../services';

const recordEvent = catchAsync(async (req: any, res: any) => {
  const { userExamId, eventType, metadata } = req.body;
  const event = await proctoringService.recordProctoringEvent(userExamId, eventType, metadata);
  res.status(httpStatus.CREATED).send(event);
});

const getEvents = catchAsync(async (req: any, res: any) => {
  const userExamId = parseInt(req.params.userExamId);
  const events = await proctoringService.getProctoringEvents(userExamId);
  res.send(events);
});

const getStatistics = catchAsync(async (req: any, res: any) => {
  const examId = req.query.examId ? parseInt(req.query.examId) : undefined;
  const statistics = await proctoringService.getProctoringStatistics(examId);
  res.send(statistics);
});

export default {
  recordEvent,
  getEvents,
  getStatistics
};
