// src/utils/catchAsync.ts
import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wrapper untuk async route handlers yang menangkap errors secara otomatis
 *
 * @template P - Route params type (default: any)
 * @template ResBody - Response body type (default: any)
 * @template ReqBody - Request body type (default: any)
 * @template ReqQuery - Request query type (default: any)
 * @template Locals - Response locals type (default: Record<string, any>)
 *
 * @example
 * const handler = catchAsync<UserIdParams, UserResponseBody, UpdateUserRequestBody>(
 *   async (req, res) => {
 *     const userId = req.params.userId; // Type-safe!
 *     const data = req.body; // Type-safe!
 *     res.send({ user: data }); // Type-safe!
 *   }
 * );
 */
const catchAsync = <
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
