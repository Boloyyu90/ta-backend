import { ProctoringEventType } from '@prisma/client';
import prisma from '../client';

const recordProctoringEvent = async (
  userExamId: number,
  eventType: ProctoringEventType,
  metadata?: any
) => {
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

  return events.reduce((acc, event) => {
    acc[event.eventType] = event._count.eventType;
    return acc;
  }, {} as Record<ProctoringEventType, number>);
};

export default {
  recordProctoringEvent,
  getProctoringEvents,
  getProctoringStatistics
};
