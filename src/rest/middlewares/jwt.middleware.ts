import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { jwtVerify, JWTVerifyResult } from 'jose';
import { Component } from '../component.js';
import { Config, RestSchema } from '../config/index.js';
import { Middleware } from '../../libs/middleware/index.js';

@injectable()
export class JwtMiddleware implements Middleware {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) { }

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    try {
      const secret = this.config.get('JWT_SECRET');
      const { payload }: JWTVerifyResult = await jwtVerify(token, Buffer.from(secret, 'utf-8'));
      res.locals.userId = payload.id as string;
      return next();
    } catch (error) {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  }
}
