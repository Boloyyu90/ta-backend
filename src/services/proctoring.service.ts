import { ProctoringEventType } from '@prisma/client';
import prisma from '../client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { ProctoringMetadata } from '../types/http/proctoring';

/**
 * Record proctoring event
 */
const recordProctoringEvent = async (
  actorUserId: number,
  userExamId: number,
  eventType: ProctoringEventType,
  metadata?: ProctoringMetadata
) => {
  // Verify ownership
  const userExam = await prisma.userExam.findUnique({
    where: { id: userExamId },
    select: { userId: true, status: true }
  });

  if (!userExam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam session not found');
  }

  if (userExam.userId !== actorUserId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Not allowed to record events for this exam session'
    );
  }

  // Only allow recording for active exams
  if (userExam.status !== 'IN_PROGRESS') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot record events for inactive exam session'
    );
  }

  // Record event
  return await prisma.proctoringEvent.create({
    data: {
      userExamId,
      eventType,
      metadata: metadata ?? null,
      eventTime: new Date()
    }
  });
};

/**
 * Get all proctoring events for a user exam
 */
const getProctoringEvents = async (userExamId: number) => {
  // Verify exam exists
  const userExam = await prisma.userExam.findUnique({
    where: { id: userExamId },
    select: { id: true }
  });

  if (!userExam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam session not found');
  }

  return await prisma.proctoringEvent.findMany({
    where: { userExamId },
    orderBy: { eventTime: 'desc' }
  });
};

/**
 * Get proctoring statistics (aggregated by event type)
 */
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

  // Type-safe result mapping
  const typedEvents = events as Array<{
    eventType: ProctoringEventType;
    _count: { eventType: number };
  }>;

  // Convert to proper response format
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
