import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../../libs/middleware/index.js';
import { isValidObjectId } from 'mongoose';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private paramName: string) { }

  execute(req: Request, res: Response, next: NextFunction): void {
    const id = req.params[this.paramName];
    if (!isValidObjectId(id)) {
      res.status(400).json({ error: `Invalid ObjectID in parameter: ${this.paramName}` });
    } else {
      return next();
    }
  }
}
