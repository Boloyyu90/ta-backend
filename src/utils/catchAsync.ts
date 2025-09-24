import { NextFunction, Request, RequestHandler, Response } from 'express';

type DefaultParams = Record<string, string>;
type DefaultQuery = Record<string, unknown>;

export type AsyncHandler<
  P = DefaultParams,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = DefaultQuery,
  Locals extends Record<string, unknown> = Record<string, unknown>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<unknown>;

const catchAsync = <
  P = DefaultParams,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = DefaultQuery,
  Locals extends Record<string, unknown> = Record<string, unknown>
>(
  handler: AsyncHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  const wrapped: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> = (
    req,
    res,
    next
  ) => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };

  return wrapped;
};

export default catchAsync;
