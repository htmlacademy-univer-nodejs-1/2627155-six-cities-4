
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../../libs/controller/index.js';
import { ValidateDtoMiddleware } from '../middlewares/dto.middleware.js';
import { Component } from '../component.js';
import { UserService } from '../services/user.service.js';
import { CreateUserDto, LoginDto } from '../dto/index.js';
import { GetUserDto } from '../dto/index.js';
import { FileUploadMiddleware } from '../middlewares/file.upload.middleware.js';

@injectable()
export class UserController extends BaseController {
  public readonly path = '/users';

  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.bindRoute({
      method: 'post',
      path: `${this.path}`,
      handler: this.createUser.bind(this),
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });

    this.bindRoute({
      method: 'post',
      path: '/login',
      handler: this.login.bind(this),
      middlewares: [new ValidateDtoMiddleware(LoginDto)],
    });

    this.bindRoute({
      method: 'get',
      path: `${this.path}/me`,
      handler: this.getCurrentUser.bind(this),
      middlewares: [],
    });

    this.bindRoute({
      method: 'post',
      path: `${this.path}/avatar`,
      handler: this.uploadProfilePicture.bind(this),
      middlewares: [new FileUploadMiddleware()],
    });
  }

  private async createUser(req: Request, res: Response<GetUserDto>) {
    const user = await this.userService.create(req.body);
    this.sendCreated(res, user);
  }

  private async login(_req: Request, res: Response<{ token: string }>) {
    // const token = await this.userService.login(req.body);
    this.sendOk(res, { token: '' });
  }

  private async getCurrentUser(_req: Request, res: Response) {
    const userId = res.locals.userId;
    const user = await this.userService.findById(userId);
    this.sendOk(res, user);
  }

  private async uploadProfilePicture(req: Request, res: Response) {
    const userId = res.locals.userId;
    const filePath = req.file?.path;

    if (!filePath) {
      return this.sendBadRequest(res, 'Файл не был загружен');
    }

    const avatarUrl = await this.userService.uploadProfilePicture(userId, filePath);
    this.sendOk(res, { avatarUrl });
  }
}
