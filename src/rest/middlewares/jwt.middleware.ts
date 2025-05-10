import { Request, Response, NextFunction } from 'express';
import { jwtVerify, JWTVerifyResult } from 'jose';
import { Config, RestSchema } from '../config/index.js';
import { Middleware } from '../../libs/middleware/index.js';

export class JwtMiddleware implements Middleware {
  constructor(
    private readonly config: Config<RestSchema>,
    private readonly allow: 'all' | 'anon' | 'auth'
  ) { }

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      if (this.allow === 'anon') {
        res.status(401).json({ message: 'Only anon users are allowed' });
        return;
      }

      try {
        const secret = this.config.get('JWT_SECRET');
        const { payload }: JWTVerifyResult = await jwtVerify(token, Buffer.from(secret, 'utf-8'));
        res.locals.userId = payload.id as string;
      } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
      }
    } else if (this.allow === 'auth') {
      res.status(401).json({ message: 'No token provided' });
    }
    return next();
  }
}
