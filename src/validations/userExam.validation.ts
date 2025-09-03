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
    id: Joi.number().integer().required()
  })
};

const getUserResults = {
  query: Joi.object().keys({
    examId: Joi.number().integer()
  })
};

export default {
  submitAnswer,
  finishExam,
  getUserResults
};