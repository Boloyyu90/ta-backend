import Joi from 'joi';

const submitAnswer = {
  body: Joi.object().keys({
    userExamId: Joi.number().integer().required(),
    examQuestionId: Joi.number().integer().required(),
    selectedOption: Joi.string().valid('A', 'B', 'C', 'D', 'E').required()
  })
};

const finishExam = {
  params: Joi.object().keys({
    id: Joi.string().pattern(/^\d+$/).required()
  })
};

const getUserResults = {
  query: Joi.object().keys({
    examId: Joi.number().integer(),
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1)
  })
};

export default {
  submitAnswer,
  finishExam,
  getUserResults
};
