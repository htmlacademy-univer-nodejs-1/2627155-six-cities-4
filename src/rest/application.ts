import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Logger } from '../libs/logger/index.js';
import { Config, RestSchema } from './config/index.js';
import { Component } from './component.js';
import { connect } from 'mongoose';
import { OfferController, UserController } from './controllers/index.js';
import { ExceptionFilter } from './errors/exception.filter.interface.js';

@injectable()
export class Application {
  private readonly app: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.UserController) private readonly usersController: UserController,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
  ) {
    this.app = express();
  }

  private registerMiddleware(): void {
    const uploadDir = this.config.get('UPLOADS_DIR');
    this.app.use('/uploads', express.static(uploadDir));
    this.app.use(express.json());
  }

  private registerControllers(): void {
    this.app.use(this.offerController.router);
    this.app.use(this.usersController.router);
  }

  public async init() {
    this.logger.info('Application initialization');

    const host = this.config.get('HOST');
    const port = this.config.get('PORT');
    const mongoUrl = this.config.get('MONGO_URL');

    this.logger.info(`Get value from env $PORT: ${port}`);
    this.logger.info(`Connecting to MongoDB using link ${mongoUrl}`);

    await connect(mongoUrl);
    this.logger.info('Connected to MongoDB');

    this.registerMiddleware();

    this.registerControllers();

    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));

    this.app.listen(port, host, () => {
      this.logger.info(`Server is running on http://${host}:${port}`);
    });
  }
}
