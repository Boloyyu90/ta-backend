import { PrismaClient, ExamStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

const submitAnswer = async (userExamId: number, examQuestionId: number, selectedOption: string) => {
  const userExam = await prisma.userExam.findUnique({
    where: { id: userExamId },
    include: { exam: true }
  });

  if (!userExam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam session not found');
  }

  if (userExam.status !== 'IN_PROGRESS') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Exam session is not active');
  }

  // Get question details to check correct answer
  const examQuestion = await prisma.examQuestion.findUnique({
    where: { id: examQuestionId },
    include: { question: true }
  });

  if (!examQuestion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  const isCorrect = examQuestion.question.correctAnswer === selectedOption;

  // Upsert answer (update if exists, create if not)
  return await prisma.answer.upsert({
    where: {
      userExamId_examQuestionId: {
        userExamId,
        examQuestionId
      }
    },
    update: {
      selectedOption,
      isCorrect,
      answeredAt: new Date()
    },
    create: {
      userExamId,
      examQuestionId,
      selectedOption,
      isCorrect,
      answeredAt: new Date()
    }
  });
};

const finishExam = async (userExamId: number) => {
  return await prisma.$transaction(async (tx) => {
    const userExam = await tx.userExam.findUnique({
      where: { id: userExamId },
      include: {
        answers: {
          include: {
            examQuestion: {
              include: { question: true }
            }
          }
        }
      }
    });

    if (!userExam) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Exam session not found');
    }

    // Calculate total score - SIMPLIFIED: use only defaultScore from question_bank
    const totalScore = userExam.answers.reduce((score, answer) => {
      if (answer.isCorrect) {
        // Simple scoring: use question's defaultScore directly
        return score + answer.examQuestion.question.defaultScore;
      }
      return score;
    }, 0);

    // Update exam session
    return await tx.userExam.update({
      where: { id: userExamId },
      data: {
        finishedAt: new Date(),
        totalScore,
        status: 'FINISHED'
      }
    });
  });
};

const getUserExamResults = async (userId: number, examId?: number) => {
  const where = examId ? { userId, examId } : { userId };

  return await prisma.userExam.findMany({
    where,
    include: {
      exam: {
        select: {
          id: true,
          title: true,
          description: true,
          durationMinutes: true
        }
      },
      answers: {
        include: {
          examQuestion: {
            include: {
              question: {
                select: {
                  id: true,
                  content: true,
                  questionType: true,
                  defaultScore: true,
                  correctAnswer: true
                }
              }
            }
          }
        }
      },
      proctoringEvents: {
        select: {
          eventType: true,
          eventTime: true,
          metadata: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getAllExamResults = async (examId?: number) => {
  const where = examId ? { examId } : {};

  return await prisma.userExam.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      exam: {
        select: {
          id: true,
          title: true,
          description: true,
          durationMinutes: true
        }
      },
      answers: {
        include: {
          examQuestion: {
            include: {
              question: {
                select: {
                  id: true,
                  content: true,
                  questionType: true,
                  defaultScore: true
                }
              }
            }
          }
        }
      },
      proctoringEvents: {
        select: {
          eventType: true,
          eventTime: true,
          metadata: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Helper function for exam statistics (useful for proctoring analysis)
const getExamStatistics = async (examId: number) => {
  const examStats = await prisma.userExam.findMany({
    where: { examId },
    include: {
      answers: {
        include: {
          examQuestion: {
            include: { question: true }
          }
        }
      },
      proctoringEvents: true
    }
  });

  const totalParticipants = examStats.length;
  const completedExams = examStats.filter((ue) => ue.status === 'FINISHED').length;
  const averageScore =
    totalParticipants > 0
      ? examStats.reduce((sum, ue) => sum + (ue.totalScore || 0), 0) / totalParticipants
      : 0;

  // Proctoring violations summary
  const proctoringViolations = examStats.reduce((acc, ue) => {
    ue.proctoringEvents.forEach((event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalParticipants,
    completedExams,
    completionRate: totalParticipants > 0 ? (completedExams / totalParticipants) * 100 : 0,
    averageScore: Math.round(averageScore * 100) / 100,
    proctoringViolations
  };
};

export default {
  submitAnswer,
  finishExam,
  getUserExamResults,
  getAllExamResults,
  getExamStatistics
};
