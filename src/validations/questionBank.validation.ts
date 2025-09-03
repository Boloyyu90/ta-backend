import Joi from 'joi';

const createQuestion = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    options: Joi.object().pattern(
      Joi.string(),
      Joi.string()
    ).required(),
    correctAnswer: Joi.string().valid('A', 'B', 'C', 'D', 'E').required(),
    defaultScore: Joi.number().integer().min(1).default(1),
    questionType: Joi.string().valid('TIU', 'TKP', 'TWK').required()
  })
};

const getQuestions = {
  query: Joi.object().keys({
    questionType: Joi.string().valid('TIU', 'TKP', 'TWK'),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getQuestion = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

const updateQuestion = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    content: Joi.string(),
    options: Joi.object().pattern(
      Joi.string(),
      Joi.string()
    ),
    correctAnswer: Joi.string().valid('A', 'B', 'C', 'D', 'E'),
    defaultScore: Joi.number().integer().min(1),
    questionType: Joi.string().valid('TIU', 'TKP', 'TWK')
  }).min(1)
};

const deleteQuestion = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

export default {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
};