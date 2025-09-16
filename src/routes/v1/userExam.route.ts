import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { userExamValidation } from '../../validations';
import { userExamController } from '../../controllers';

const router = express.Router();

router
  .route('/answers')
  .post(
    auth('takeExam'),
    validate(userExamValidation.submitAnswer),
    userExamController.submitAnswer
  );

router
  .route('/:id/finish')
  .post(auth('takeExam'), validate(userExamValidation.finishExam), userExamController.finishExam);

router
  .route('/results')
  .get(
    auth('viewResults'),
    validate(userExamValidation.getUserResults),
    userExamController.getUserResults
  );

router
  .route('/all-results')
  .get(
    auth('viewAllResults'),
    validate(userExamValidation.getUserResults),
    userExamController.getAllResults
  );

export default router;
