import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err: any) => next(err));
};

export default catchAsync;
