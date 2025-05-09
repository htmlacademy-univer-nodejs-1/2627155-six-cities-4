import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../../libs/middleware/index.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private readonly dtoClass: new () => object) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoObject = plainToInstance(this.dtoClass, req.body);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      res.status(400).json({
        message: 'Validation failed',
        errors: formattedErrors,
      });
      return;
    }

    req.body = dtoObject;
    next();
  }
}
