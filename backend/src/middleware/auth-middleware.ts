import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ClientError } from './client-error';

const hashKey = process.env.TOKEN_SECRET ?? '';
if (!hashKey) throw new Error('TOKEN_SECRET not found in env');

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = req.get('Authorization');
  const token = auth?.split('Bearer ')[1];
  if (!auth || !token) {
    throw new ClientError(401, 'authentication required');
  }
  try {
    const payload = jwt.verify(token, hashKey);
    req.user = payload as Express.Request['user'];
    next();
  } catch {
    throw new ClientError(401, 'authentication required');
  }
}

/*
 * Get the 'Authorization' header from the request.
 * Parse the token from the header; e.g., auth.split('Bearer ')[1]
 * Note: the space after `Bearer` is important.
 * If no header or no token is provided,
 *   throw a 401 error with the message 'authentication required'
 * Use jwt.verify() to verify the authenticity of the token and extract its payload.
 * Note: You need the TOKEN_SECRET (see `hashKey` above).
 * Assign the extracted payload to the user property of the req object.
 * Note: The TypeScript for this assignment is best written with a type assertion:
 *   req.user = payload as Request['user'];
 * Call next() (with no arguments) to let Express know to advance to its next route or middleware.
 */
