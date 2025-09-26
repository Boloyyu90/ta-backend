import { Prisma } from '@prisma/client';
import { EmptyObject } from './common';

export type ProctoringEventTypeString = 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES';

export interface RecordEventRequestBody {
  userExamId: number;
  eventType: ProctoringEventTypeString;
  metadata?: Prisma.JsonValue;  // ✅ Changed from Record<string, unknown>
}

export type RecordEventRequestParams = EmptyObject;
export type RecordEventRequestQuery = EmptyObject;

export interface GetEventsParams {
  userExamId: string;
}

export type GetEventsRequestBody = EmptyObject;
export type GetEventsRequestQuery = EmptyObject;

export interface GetStatisticsQuery {
  examId?: number;
}

export type GetStatisticsParams = EmptyObject;
export type GetStatisticsRequestBody = EmptyObject;
