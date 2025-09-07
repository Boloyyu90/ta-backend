import { PrismaClient, ExamStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

const createExam = async (examData: {
  title: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  durationMinutes?: number;
  createdBy: number;
  questions?: { questionId: number; orderNumber?: number}[];
}) => {
  const { questions, ...examInfo } = examData;

  return await prisma.$transaction(async (tx) => {
    const exam = await tx.exam.create({
      data: examInfo
    });

    if (questions && questions.length > 0) {
      await tx.examQuestion.createMany({
        data: questions.map((q, index) => ({
          examId: exam.id,
          questionId: q.questionId,
          orderNumber: q.orderNumber || index + 1,
        }))
      });
    }

    return exam;
  });
};

const getExams = async (filter: {
  createdBy?: number;
  limit?: number;
  page?: number;
}) => {
  const skip = filter.page ? (filter.page - 1) * (filter.limit || 10) : 0;
  const take = filter.limit || 10;

  const where = filter.createdBy ? { createdBy: filter.createdBy } : {};

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where,
      skip,
      take,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { examQuestions: true, userExams: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.exam.count({ where })
  ]);

  return { exams, total };
};

const getExamById = async (id: number, includeQuestions = false) => {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, name: true, email: true }
      },
      examQuestions: includeQuestions ? {
        include: {
          question: true
        },
        orderBy: { orderNumber: 'asc' }
      } : false,
      _count: {
        select: { examQuestions: true, userExams: true }
      }
    }
  });

  if (!exam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  return exam;
};

const updateExam = async (id: number, updateData: any) => {
  const exam = await getExamById(id);
  return await prisma.exam.update({
    where: { id },
    data: updateData
  });
};

const startExam = async (examId: number, userId: number) => {
  // Check if exam exists and is available
  const exam = await getExamById(examId);
  
  if (exam.startTime && new Date() < exam.startTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Exam has not started yet');
  }
  
  if (exam.endTime && new Date() > exam.endTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Exam has ended');
  }

  // Check if user already has an active session
  const existingSession = await prisma.userExam.findUnique({
    where: { userId_examId: { userId, examId } }
  });

  if (existingSession) {
    if (existingSession.status === 'FINISHED') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Exam already completed');
    }
    return existingSession;
  }

  // Create new exam session
  return await prisma.userExam.create({
    data: {
      userId,
      examId,
      startedAt: new Date(),
      status: 'IN_PROGRESS'
    }
  });
};

export default {
  createExam,
  getExams,
  getExamById,
  updateExam,
  startExam
};