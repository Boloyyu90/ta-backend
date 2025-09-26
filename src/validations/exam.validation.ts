import Joi from 'joi';

const createExam = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    startTime: Joi.date().iso(),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')),
    durationMinutes: Joi.number().integer().min(1),
    questions: Joi.array().items(
      Joi.object().keys({
        questionId: Joi.number().integer().required(),
        orderNumber: Joi.number().integer().min(1),
        scoreOverride: Joi.number().integer().min(1)
      })
    )
  })
};

const getExams = {
  query: Joi.object().keys({
    title: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string()
  })
};

const getExam = {
  params: Joi.object().keys({
    id: Joi.string().pattern(/^\d+$/).required()
  }),
  query: Joi.object().keys({
    include: Joi.string().valid('questions')
  })
};

const startExam = {
  params: Joi.object().keys({
    id: Joi.string().pattern(/^\d+$/).required()
  })
};

const updateExam = {
  params: Joi.object().keys({
    id: Joi.string().pattern(/^\d+$/).required()
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string().allow(''),
      startTime: Joi.date().iso(),
      endTime: Joi.date().iso(),
      durationMinutes: Joi.number().integer().min(1)
    })
    .min(1)
};

export default {
  createExam,
  getExams,
  getExam,
  startExam,
  updateExam
};
