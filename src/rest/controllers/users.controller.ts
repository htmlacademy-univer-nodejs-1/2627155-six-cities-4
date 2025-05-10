import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../../libs/controller/index.js';
import { ValidateDtoMiddleware } from '../middlewares/dto.middleware.js';
import { Component } from '../component.js';
import { UserService } from '../services/user.service.js';
import { CreateUserDto, LoginDto } from '../dto/index.js';
import { GetUserDto } from '../dto/index.js';
import { FileUploadMiddleware } from '../middlewares/file.upload.middleware.js';
import { Config, RestSchema } from '../config/index.js';
import { JwtMiddleware, ValidateObjectIdMiddleware } from '../middlewares/index.js';

@injectable()
export class UserController extends BaseController {
  public readonly path = '/users';

  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.bindRoute({
      method: 'post',
      path: `${this.path}`,
      handler: this.createUser.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'anon'),
        new ValidateDtoMiddleware(CreateUserDto)],
    });

    this.bindRoute({
      method: 'get',
      path: `${this.path}/:userId/`,
      handler: this.findUserById.bind(this),
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new JwtMiddleware(this.config, 'all'),
      ],
    });

    this.bindRoute({
      method: 'post',
      path: `${this.path}/login`,
      handler: this.login.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'anon'),
        new ValidateDtoMiddleware(LoginDto)
      ],
    });

    this.bindRoute({
      method: 'get',
      path: `${this.path}/me`,
      handler: this.getCurrentUser.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
      ],
    });

    this.bindRoute({
      method: 'post',
      path: `${this.path}/me/picture`,
      handler: this.uploadProfilePicture.bind(this),
      middlewares: [
        new JwtMiddleware(this.config, 'auth'),
        new FileUploadMiddleware()
      ],
    });
  }

  private async createUser(req: Request, res: Response<{ user: GetUserDto, token: string }>) {
    const createResult = await this.userService.create(req.body);
    this.sendCreated(res, createResult);
  }

  private async login(req: Request, res: Response<{ user: GetUserDto, token: string }>) {
    const loginResult = await this.userService.login(req.body);
    this.sendOk(res, loginResult);
  }

  private async getCurrentUser(_req: Request, res: Response) {
    const userId = res.locals.userId;
    const user = await this.userService.findById(userId);
    this.sendOk(res, user);
  }

  private async findUserById(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await this.userService.findById(userId);
    this.sendOk(res, user);
  }

  private async uploadProfilePicture(req: Request, res: Response) {
    const userId = res.locals.userId;
    const fileName = req.file?.filename;

    if (!fileName) {
      return this.sendBadRequest(res, 'Файл не был загружен');
    }

    const url = await this.userService.uploadProfilePicture(userId, fileName);
    this.sendOk(res, { url });
  }
}
