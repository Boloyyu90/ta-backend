import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { questionBankValidation } from '../../validations';
import { questionBankController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageQuestions'),
    validate(questionBankValidation.createQuestion),
    questionBankController.createQuestion
  )
  .get(
    auth(),
    validate(questionBankValidation.getQuestions),
    questionBankController.getQuestions
  );

router
  .route('/:id')
  .get(
    auth(),
    validate(questionBankValidation.getQuestion),
    questionBankController.getQuestion
  )
  .patch(
    auth('manageQuestions'),
    validate(questionBankValidation.updateQuestion),
    questionBankController.updateQuestion
  )
  .delete(
    auth('manageQuestions'),
    validate(questionBankValidation.deleteQuestion),
    questionBankController.deleteQuestion
  );

export default router;
