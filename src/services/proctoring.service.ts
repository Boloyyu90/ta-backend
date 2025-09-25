import { Prisma, ProctoringEventType } from '@prisma/client';
import prisma from '../client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const recordProctoringEvent = async (
  actorUserId: number,
  userExamId: number,
  eventType: ProctoringEventType,
  metadata?: Prisma.JsonValue
) => {
  const userExam = await prisma.userExam.findUnique({
    where: { id: userExamId },
    select: { userId: true }
  });

  if (!userExam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam session not found');
  }

  if (userExam.userId !== actorUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not allowed to record events for this exam session');
  }

  return await prisma.proctoringEvent.create({
    data: {
      userExamId,
      eventType,
      metadata,
      eventTime: new Date()
    }
  });
};

const getProctoringEvents = async (userExamId: number) => {
  return await prisma.proctoringEvent.findMany({
    where: { userExamId },
    orderBy: { eventTime: 'desc' }
  });
};

const getProctoringStatistics = async (examId?: number) => {
  const where = examId
    ? {
        userExam: { examId }
      }
    : {};

  const events = await prisma.proctoringEvent.groupBy({
    by: ['eventType'],
    where,
    _count: {
      eventType: true
    }
  });

  const typedEvents = events as Array<{
    eventType: ProctoringEventType;
    _count: { eventType: number };
  }>;

  return typedEvents.reduce<Record<ProctoringEventType, number>>(
    (acc, event) => {
      acc[event.eventType] = event._count.eventType;
      return acc;
    },
    {} as Record<ProctoringEventType, number>
  );
};

export default {
  recordProctoringEvent,
  getProctoringEvents,
  getProctoringStatistics
};
