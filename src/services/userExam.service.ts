import prisma from '../client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

type AnswerWithQuestion = {
  isCorrect: boolean | null;
  examQuestion: {
    question: {
      defaultScore: number;
    };
  };
};

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

  // Get question details untuk cek jawaban benar
  const examQuestion = await prisma.examQuestion.findUnique({
    where: { id: examQuestionId },
    include: { question: true }
  });

  if (!examQuestion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  if (examQuestion.examId !== userExam.examId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Question does not belong to this exam');
  }

  const isCorrect = examQuestion.question.correctAnswer === selectedOption;

  // Upsert answer (update jika ada, dan create jika belum ada)
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
  return await prisma.$transaction(async (tx: any) => {
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

    // Kalkulasi total score(simplifikasi dengan total defaultScore tiap soal)
    const totalScore = userExam.answers.reduce((score: number, answer: AnswerWithQuestion) => {
      if (answer.isCorrect) {

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

const getAllExamResults = async (
  examId?: number,
  pagination: { limit?: number; page?: number } = {}
) => {
  const where = examId ? { examId } : {};
  const limit = pagination.limit && pagination.limit > 0 ? pagination.limit : 10;
  const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.userExam.findMany({
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.userExam.count({ where })
  ]);

  return {
    data,
    total,
    page,
    limit
  };
};

export default {
  submitAnswer,
  finishExam,
  getUserExamResults,
  getAllExamResults
};
