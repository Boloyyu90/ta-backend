import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { Request, Response } from 'express';
import { proctoringService } from '../services';
import {
  GetEventsParams,
  GetEventsRequestBody,
  GetEventsRequestQuery,
  GetStatisticsParams,
  GetStatisticsQuery,
  GetStatisticsRequestBody,
  RecordEventRequestBody,
  RecordEventRequestParams,
  RecordEventRequestQuery
} from '../types/http/proctoring';

const recordEvent = catchAsync(
  async (
    req: Request<RecordEventRequestParams, unknown, RecordEventRequestBody, RecordEventRequestQuery>,
    res: Response<unknown>
  ) => {
    const { userExamId, eventType, metadata } = req.body;
    const event = await proctoringService.recordProctoringEvent(
      req.user!.id,
      userExamId,
      eventType,
      metadata
    );
    res.status(httpStatus.CREATED).send(event);
  }
);

const getEvents = catchAsync(
  async (
    req: Request<GetEventsParams, unknown, GetEventsRequestBody, GetEventsRequestQuery>,
    res: Response<unknown>
  ) => {
    const userExamId = parseId(req.params.userExamId, 'user exam ID');
    const events = await proctoringService.getProctoringEvents(userExamId);
    res.send(events);
  }
);

const getStatistics = catchAsync(
  async (
    req: Request<GetStatisticsParams, unknown, GetStatisticsRequestBody, GetStatisticsQuery>,
    res: Response<unknown>
  ) => {
    const statistics = await proctoringService.getProctoringStatistics(req.query.examId);
    res.send(statistics);
  }
);

export default {
  recordEvent,
  getEvents,
  getStatistics
} as any;
