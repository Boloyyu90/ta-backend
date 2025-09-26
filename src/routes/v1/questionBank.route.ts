import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { questionBankValidation } from '../../validations';
import { questionBankController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageQuestions'), // ✅ Already restricted to ADMIN
    validate(questionBankValidation.createQuestion),
    questionBankController.createQuestion
  )
  .get(
    auth('manageQuestions'), // ✅ FIXED: Changed from auth() to auth('manageQuestions')
    validate(questionBankValidation.getQuestions),
    questionBankController.getQuestions
  );

router
  .route('/:id')
  .get(
    auth('manageQuestions'), // ✅ FIXED: Changed from auth() to auth('manageQuestions')
    validate(questionBankValidation.getQuestion),
    questionBankController.getQuestion
  )
  .patch(
    auth('manageQuestions'), // ✅ Already restricted to ADMIN
    validate(questionBankValidation.updateQuestion),
    questionBankController.updateQuestion
  )
  .delete(
    auth('manageQuestions'), // ✅ Already restricted to ADMIN
    validate(questionBankValidation.deleteQuestion),
    questionBankController.deleteQuestion
  );

export default router;
