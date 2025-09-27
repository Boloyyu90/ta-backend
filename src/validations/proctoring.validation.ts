import Joi from 'joi';

// Metadata schema dengan struktur yang jelas
const metadataSchema = Joi.object({
  faceCount: Joi.number().integer().min(0),
  confidence: Joi.number().min(0).max(1),
  timestamp: Joi.string().isoDate(),
  screenshot: Joi.string().uri(),
  deviceInfo: Joi.object({
    userAgent: Joi.string(),
    platform: Joi.string(),
    screenResolution: Joi.string()
  }),
  violations: Joi.array().items(Joi.string())
}).unknown(true); // Allow additional fields

const recordEvent = {
  body: Joi.object().keys({
    userExamId: Joi.number().integer().required(),
    eventType: Joi.string()
      .valid('FACE_NOT_DETECTED', 'MULTIPLE_FACES')
      .required(),
    metadata: metadataSchema.optional()
  })
};

const getEvents = {
  params: Joi.object().keys({
    userExamId: Joi.string().pattern(/^\d+$/).required()
  })
};

const getStatistics = {
  query: Joi.object().keys({
    examId: Joi.number().integer().min(1)
  })
};

export default {
  recordEvent,
  getEvents,
  getStatistics
};
