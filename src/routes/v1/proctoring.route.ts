import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { proctoringValidation } from '../../validations';
import { proctoringController } from '../../controllers';

const router = express.Router();

router
  .route('/events')
  .post(
    auth('takeExam'),
    validate(proctoringValidation.recordEvent),
    proctoringController.recordEvent
  );

router
  .route('/events/:userExamId')
  .get(
    auth('viewProctoringEvents'),
    validate(proctoringValidation.getEvents),
    proctoringController.getEvents
  );

router
  .route('/statistics')
  .get(
    auth('viewProctoringEvents'),
    validate(proctoringValidation.getStatistics),
    proctoringController.getStatistics
  );

export default router;