import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import questionBankRoute from './questionBank.route';
import examRoute from './exam.route';
import userExamRoute from './userExam.route';
import proctoringRoute from './proctoring.route';
import config from '../../config/config';

const router = express.Router();

interface RouteConfig {
  path: string;
  route: express.Router;
}

const defaultRoutes: RouteConfig[] = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/questionbank',
    route: questionBankRoute
  },
  {
    path: '/exams',
    route: examRoute
  },
  {
    path: '/user-exams',
    route: userExamRoute
  },
  {
    path: '/proctoring',
    route: proctoringRoute
  }
];

const devRoutes: RouteConfig[] = [
  // routes available only in development mode
  // {
  //   path: '/docs',
  //   route: docsRoute
  // }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
