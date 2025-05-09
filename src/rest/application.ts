import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Logger } from '../libs/logger/index.js';
import { Config, RestSchema } from './config/index.js';
import { Component } from './component.js';
import { connect } from 'mongoose';
import { OfferController } from './controllers/index.js';
import { ExceptionFilter } from './errors/exception.filter.interface.js';
import { JwtMiddleware } from './middleware/index.js';

@injectable()
export class Application {
  private readonly app: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.JwtMiddleware) private readonly jwtMiddleware: JwtMiddleware,
  ) {
    this.app = express();
  }

  private registerMiddleware(): void {
    this.app.use(express.json());
    this.app.use(this.jwtMiddleware.authenticate.bind(this.jwtMiddleware));
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private registerControllers(): void {
    this.app.use(this.offerController.router);
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

    this.app.listen(port, host, () => {
      this.logger.info(`Server is running on http://${host}:${port}`);
    });
  }
}
