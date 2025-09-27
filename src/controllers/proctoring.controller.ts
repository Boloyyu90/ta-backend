// src/controllers/proctoring.controller.ts
import httpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import parseId from '../utils/parseId';
import { proctoringService } from '../services';
import {
  GetEventsParams,
  GetEventsRequestBody,
  GetEventsRequestQuery,
  GetEventsResponseBody,
  GetStatisticsParams,
  GetStatisticsQuery,
  GetStatisticsRequestBody,
  GetStatisticsResponseBody,
  RecordEventRequestBody,
  RecordEventRequestParams,
  RecordEventRequestQuery,
  RecordEventResponseBody
} from '../types/http/proctoring';

// ============================================
// INTERFACE DEFINITION
// ============================================
interface ProctoringController {
  recordEvent: RequestHandler<
    RecordEventRequestParams,
    RecordEventResponseBody,
    RecordEventRequestBody,
    RecordEventRequestQuery
  >;
  getEvents: RequestHandler<
    GetEventsParams,
    GetEventsResponseBody,
    GetEventsRequestBody,
    GetEventsRequestQuery
  >;
  getStatistics: RequestHandler<
    GetStatisticsParams,
    GetStatisticsResponseBody,
    GetStatisticsRequestBody,
    GetStatisticsQuery
  >;
}

// ============================================
// CONTROLLER IMPLEMENTATION
// ============================================

const recordEvent = catchAsync<
  RecordEventRequestParams,
  RecordEventResponseBody,
  RecordEventRequestBody,
  RecordEventRequestQuery
>(async (req, res) => {
  const { userExamId, eventType, metadata } = req.body;
  const { id: actorUserId } = req.user as { id: number };

  const event = await proctoringService.recordProctoringEvent(
    actorUserId,
    userExamId,
    eventType,
    metadata
  );

  res.status(httpStatus.CREATED).send(event);
});

const getEvents = catchAsync<
  GetEventsParams,
  GetEventsResponseBody,
  GetEventsRequestBody,
  GetEventsRequestQuery
>(async (req, res) => {
  const userExamId = parseId(req.params.userExamId, 'user exam ID');
  const events = await proctoringService.getProctoringEvents(userExamId);
  res.send(events);
});

const getStatistics = catchAsync<
  GetStatisticsParams,
  GetStatisticsResponseBody,
  GetStatisticsRequestBody,
  GetStatisticsQuery
>(async (req, res) => {
  const statistics = await proctoringService.getProctoringStatistics(req.query.examId);
  res.send(statistics);
});

// ============================================
// TYPED EXPORT
// ============================================
const proctoringController: ProctoringController = {
  recordEvent,
  getEvents,
  getStatistics
};

export default proctoringController;
