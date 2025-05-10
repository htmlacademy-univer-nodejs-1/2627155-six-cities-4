import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception.filter.interface.js';
import { HttpError } from './http.error.js';
import { Component } from '../component.js';
import { Logger } from '../../libs/logger/logger.interface.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
  }

  private log(error: Error | HttpError, req: Request, res: Response) {
    this.logger.info('Request handled', { url: req.url, res, error });
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    this.log(error, req, res);
    if (error instanceof HttpError) {
      res.status(error.httpStatusCode).json({ error: error.message });
    } else if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
    return next();
  }
}
