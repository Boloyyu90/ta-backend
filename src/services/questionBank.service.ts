import { PrismaClient, QuestionType } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

const createQuestion = async (questionData: {
  content: string;
  options: Record<string, string>;
  correctAnswer: string;
  defaultScore?: number;
  questionType: QuestionType;
}) => {
  return await prisma.questionBank.create({
    data: questionData
  });
};

const getQuestions = async (filter: {
  questionType?: QuestionType;
  limit?: number;
  page?: number;
}) => {
  const skip = filter.page ? (filter.page - 1) * (filter.limit || 10) : 0;
  const take = filter.limit || 10;

  const where = filter.questionType ? { questionType: filter.questionType } : {};

  const [questions, total] = await Promise.all([
    prisma.questionBank.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.questionBank.count({ where })
  ]);

  return { questions, total };
};

const getQuestionById = async (id: number) => {
  const question = await prisma.questionBank.findUnique({
    where: { id }
  });
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  return question;
};

const updateQuestion = async (id: number, updateData: any) => {
  const question = await getQuestionById(id);
  return await prisma.questionBank.update({
    where: { id },
    data: updateData
  });
};

const deleteQuestion = async (id: number) => {
  const question = await getQuestionById(id);
  return await prisma.questionBank.delete({
    where: { id }
  });
};

export default {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};