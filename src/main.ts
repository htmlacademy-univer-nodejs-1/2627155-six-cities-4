import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './libs/logger/index.js';
import { Application } from './rest/index.js';
import { Config, RestConfig, RestSchema } from './rest/config/index.js';
import { Component } from './rest/component.js';
import { MongooseCommentRepository, MongooseOfferRepository, MongooseUserRepository, OfferRepository, UserRepository } from './db/repos/index.js';
import { CommentRepository } from './db/repos/index.js';
import { CommentService, OfferService } from './rest/services/index.js';
import { OfferController, UserController } from './rest/controllers/index.js';
import { ExceptionFilter } from './rest/errors/exception.filter.interface.js';
import { AppExceptionFilter } from './rest/errors/app.exception.filter.js';
import { UserService } from './rest/services/user.service.js';


async function bootstrap() {
  const container = new Container();
  container.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<OfferRepository>(Component.OfferRepository).to(MongooseOfferRepository).inSingletonScope();
  container.bind<UserRepository>(Component.UserRepository).to(MongooseUserRepository).inSingletonScope();
  container.bind<CommentRepository>(Component.CommentRepository).to(MongooseCommentRepository).inSingletonScope();
  container.bind<OfferService>(Component.OfferService).to(OfferService).inSingletonScope();
  container.bind<UserService>(Component.UserService).to(UserService).inSingletonScope();
  container.bind<CommentService>(Component.CommentService).to(CommentService).inSingletonScope();
  container.bind<OfferController>(Component.OfferController).to(OfferController).inSingletonScope();
  container.bind<UserController>(Component.UserController).to(UserController).inSingletonScope();
  container.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  const application = container.get<Application>(Component.RestApplication);
  await application.init();
}

bootstrap();
