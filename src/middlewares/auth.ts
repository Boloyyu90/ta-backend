import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { NextFunction, Request, Response } from 'express';
import type { AuthUser } from '../types/express';

const verifyCallback =
  (
    req: Request & { user?: AuthUser },
    resolve: (value?: void | PromiseLike<void>) => void,
    reject: (reason?: ApiError) => void,
    requiredRights: string[]
  ) =>
      async (err: unknown, user: AuthUser | false, info: unknown) => {
        if (err || info || !user) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        if (requiredRights.length) {
          const userRights = roleRights.get(user.role) || [];
          const hasRequiredRights = requiredRights.every((r) => userRights.includes(r));

          const sameUser =
            req.params?.userId !== undefined ? String(req.params.userId) === String(user.id) : false;

          if (!hasRequiredRights && !sameUser) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
          }
        }

        resolve();
      };

      const auth =
        (...requiredRights: string[]) =>
          async (req: Request, res: Response, next: NextFunction) => {
            return new Promise<void>((resolve, reject) => {
              passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, resolve, reject, requiredRights)
              )(req, res, next);
            })
              .then(() => next())
              .catch((err) => next(err));
          };

export default auth;
