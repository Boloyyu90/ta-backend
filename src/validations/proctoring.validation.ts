import Joi from 'joi';

const recordEvent = {
  body: Joi.object().keys({
    userExamId: Joi.number().integer().required(),
    eventType: Joi.string().valid('FACE_NOT_DETECTED', 'MULTIPLE_FACES').required(),
    metadata: Joi.object()
  })
};

const getEvents = {
  params: Joi.object().keys({
    userExamId: Joi.number().integer().required()
  })
};

const getStatistics = {
  query: Joi.object().keys({
    examId: Joi.number().integer()
  })
};

export default {
  recordEvent,
  getEvents,
  getStatistics
};