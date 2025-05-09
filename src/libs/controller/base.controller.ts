import { Response, Router } from 'express';
import { Controller } from './index.js';
import { Route } from './route.js';

export abstract class BaseController implements Controller {
  abstract path: string;
  private readonly router = Router();

  protected sendOk<T>(res: Response, data: T) {
    res.status(200).json(data);
  }

  protected sendCreated<T>(res: Response, data: T) {
    res.status(201).json(data);
  }

  protected sendNoContent(res: Response) {
    res.sendStatus(204);
  }

  protected sendBadRequest(res: Response, message: string) {
    res.status(400).json({ error: message });
  }

  protected sendNotFound(res: Response, message: string) {
    res.status(404).json({ error: message });
  }

  protected sendServerError(res: Response, message = 'Internal server error') {
    res.status(500).json({ error: message });
  }

  protected bindRoute(route: Route) {
    const middlewares = route.middlewares?.map((m) => m.execute.bind(m)) || [];
    switch (route.method) {
      case 'get':
        this.router.get(route.path, ...middlewares, route.handler);
        break;
      case 'post':
        this.router.post(route.path, ...middlewares, route.handler);
        break;
      case 'put':
        this.router.post(route.path, ...middlewares, route.handler);
        break;
      case 'delete':
        this.router.post(route.path, ...middlewares, route.handler);
        break;
      case 'patch':
        this.router.post(route.path, ...middlewares, route.handler);
        break;
    }
  }
}
