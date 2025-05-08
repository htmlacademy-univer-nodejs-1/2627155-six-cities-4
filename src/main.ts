import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './libs/logger/index.js';
import { Application } from './rest/index.js';
import { Config, RestConfig, RestSchema } from './rest/config/index.js';
import { Component } from './rest/component.js';
import { MongooseCommentRepository, MongooseOfferRepository, MongooseUserRepository, OfferRepository, UserRepository } from './db/repos/index.js';
import { CommentRepository } from './db/repos/index.js';


async function bootstrap() {
  const container = new Container();
  container.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<OfferRepository>(Component.OfferRepository).to(MongooseOfferRepository).inSingletonScope();
  container.bind<UserRepository>(Component.UserRepository).to(MongooseUserRepository).inSingletonScope();
  container.bind<CommentRepository>(Component.CommentRepository).to(MongooseCommentRepository);

  const application = container.get<Application>(Component.RestApplication);
  await application.init();
}

bootstrap();
