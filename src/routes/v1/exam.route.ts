import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { examValidation } from '../../validations';
import { examController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageExams'), validate(examValidation.createExam), examController.createExam)
  .get(auth(), validate(examValidation.getExams), examController.getExams);

router
  .route('/:id')
  .get(auth(), validate(examValidation.getExam), examController.getExam)
  .patch(auth('manageExams'), validate(examValidation.updateExam), examController.updateExam);

router
  .route('/:id/start')
  .post(auth('takeExam'), validate(examValidation.startExam), examController.startExam);

export default router;
