import { EmptyObject } from './common';
import { QuestionOptionKey } from './questionBank';

// ============================================
// SUBMIT ANSWER
// ============================================
export interface SubmitAnswerRequestBody {
  userExamId: number;
  examQuestionId: number;
  selectedOption: QuestionOptionKey;
}

export type SubmitAnswerRequestParams = EmptyObject;
export type SubmitAnswerRequestQuery = EmptyObject;
export type SubmitAnswerResponseBody = {
  id: number;
  userExamId: number;
  examQuestionId: number;
  selectedOption: string | null;
  isCorrect: boolean | null;
  answeredAt: Date;
};

// ============================================
// FINISH EXAM
// ============================================
export interface FinishExamParams {
  id: string; // ✅ Always string from Express
}

export type FinishExamRequestBody = EmptyObject;
export type FinishExamRequestQuery = EmptyObject;
export type FinishExamResponseBody = {
  id: number;
  userId: number;
  examId: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  totalScore: number | null;
  status: string;
  createdAt: Date;
};

// ============================================
// GET USER RESULTS
// ============================================
export interface GetUserResultsQuery {
  examId?: number;
}

export type GetUserResultsParams = EmptyObject;
export type GetUserResultsRequestBody = EmptyObject;
export type GetUserResultsResponseBody = Array<{
  id: number;
  userId: number;
  examId: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  totalScore: number | null;
  status: string;
  createdAt: Date;
  exam: {
    id: number;
    title: string;
    description: string | null;
    durationMinutes: number | null;
  };
  answers: Array<{
    id: number;
    userExamId: number;
    examQuestionId: number;
    selectedOption: string | null;
    isCorrect: boolean | null;
    answeredAt: Date;
    examQuestion: {
      id: number;
      examId: number;
      questionId: number;
      orderNumber: number | null;
      question: {
        id: number;
        content: string;
        questionType: string;
        defaultScore: number;
        correctAnswer: string;
      };
    };
  }>;
  proctoringEvents: Array<{
    eventType: string;
    eventTime: Date;
    metadata: any;
  }>;
}>;

// ============================================
// GET ALL RESULTS (ADMIN)
// ============================================
export interface GetAllResultsQuery extends GetUserResultsQuery {
  limit?: number;
  page?: number;
}

export type GetAllResultsParams = EmptyObject;
export type GetAllResultsRequestBody = EmptyObject;
export type GetAllResultsResponseBody = {
  data: Array<{
    id: number;
    userId: number;
    examId: number;
    startedAt: Date | null;
    finishedAt: Date | null;
    totalScore: number | null;
    status: string;
    createdAt: Date;
    user: {
      id: number;
      name: string;
      email: string;
    };
    exam: {
      id: number;
      title: string;
      description: string | null;
      durationMinutes: number | null;
    };
    answers: Array<{
      id: number;
      userExamId: number;
      examQuestionId: number;
      selectedOption: string | null;
      isCorrect: boolean | null;
      answeredAt: Date;
      examQuestion: {
        id: number;
        examId: number;
        questionId: number;
        orderNumber: number | null;
        question: {
          id: number;
          content: string;
          questionType: string;
          defaultScore: number;
        };
      };
    }>;
    proctoringEvents: Array<{
      eventType: string;
      eventTime: Date;
      metadata: any;
    }>;
  }>;
  total: number;
  page: number;
  limit: number;
};
