import { Router, Request, Response } from 'express';
import { BaseController, Controller } from '../../libs/controller/index.js';
import { GetUserDto, } from '../dto/index.js';

export class UserController extends BaseController implements Controller {
  public readonly path = '/users';
  private readonly router = Router();

  constructor(
  ) {
    super();
    this.registerRoutes();
  }

  public registerRoutes(): void {
    this.router.get(`${this.path}`, this.getUsers.bind(this));
    this.router.post(`${this.path}`, this.createUser.bind(this));
    this.router.get(`${this.path}/:userId`, this.getUserDetails.bind(this));
    this.router.put(`${this.path}/:userId`, this.updateUser.bind(this));
    this.router.delete(`${this.path}/:userId`, this.deleteUser.bind(this));
  }

  private async getUsers(_req: Request, _res: Response): Promise<void> {
  }

  private async createUser(_req: Request, _res: Response<GetUserDto>): Promise<void> {
  }

  private async getUserDetails(_req: Request, _res: Response<GetUserDto>): Promise<void> {
  }

  private async updateUser(_req: Request, _res: Response<GetUserDto>): Promise<void> {
  }

  private async deleteUser(_req: Request, _res: Response): Promise<void> {
  }
}
