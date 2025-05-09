import { Middleware } from '../../libs/middleware/index.js';
import { Request, Response, NextFunction } from 'express';
import { Repository } from '../../db/repos/index.js';

export class CheckDocumentExistsMiddleware implements Middleware {
  constructor(private readonly repository: Repository, private readonly paramName: string) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params[this.paramName];
      const exists = await this.repository.exists(id);

      if (!exists) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
