import { inject, injectable } from 'inversify';
import { Logger } from '../libs/logger/index.js';
import { Config, RestSchema } from './config/index.js';
import { Component } from './component.js';
import { connect } from 'mongoose';

@injectable()
export class Application {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) { }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const mongoUrl = this.config.get('MONGO_URL');
    this.logger.info(`Connecting to MongoDB using link ${mongoUrl}`);
    await connect(mongoUrl);
    this.logger.info('Connected to MongoDB');
  }
}
