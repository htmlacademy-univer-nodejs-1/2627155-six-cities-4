import { RequestHandler } from 'express';
import { Middleware } from '../middleware/middleware.interface.js';

export interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: RequestHandler;
  middlewares?: Middleware[];
}
