import { EmptyObject } from './common';

export type ProctoringEventTypeString = 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES';

// ============================================
// PROCTORING METADATA
// ============================================
export interface ProctoringMetadata {
  faceCount?: number;
  confidence?: number;
  timestamp?: string;
  screenshot?: string;
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    screenResolution?: string;
  };
  violations?: string[];
  [key: string]: unknown; // Allow additional properties
}

// ============================================
// RECORD EVENT
// ============================================
export interface RecordEventRequestBody {
  userExamId: number;
  eventType: ProctoringEventTypeString;
  metadata?: ProctoringMetadata;
}

export type RecordEventRequestParams = EmptyObject;
export type RecordEventRequestQuery = EmptyObject;
export type RecordEventResponseBody = {
  id: number;
  userExamId: number;
  eventType: ProctoringEventTypeString;
  eventTime: Date;
  metadata: ProctoringMetadata | null;
};

// ============================================
// GET EVENTS
// ============================================
export interface GetEventsParams {
  userExamId: string; // ✅ Always string from Express
}

export type GetEventsRequestBody = EmptyObject;
export type GetEventsRequestQuery = EmptyObject;
export type GetEventsResponseBody = Array<{
  id: number;
  userExamId: number;
  eventType: ProctoringEventTypeString;
  eventTime: Date;
  metadata: ProctoringMetadata | null;
}>;

// ============================================
// GET STATISTICS
// ============================================
export interface GetStatisticsQuery {
  examId?: number;
}

export type GetStatisticsParams = EmptyObject;
export type GetStatisticsRequestBody = EmptyObject;
export type GetStatisticsResponseBody = {
  FACE_NOT_DETECTED?: number;
  MULTIPLE_FACES?: number;
};
