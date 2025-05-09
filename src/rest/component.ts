export const Component = {
  RestApplication: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  CommentRepository: Symbol.for('CommentRepository'),
  OfferRepository: Symbol.for('OfferRepository'),
  UserRepository: Symbol.for('UserRepository'),
  OfferService: Symbol.for('OfferService'),
  CommentService: Symbol.for('CommentService'),
  OfferController: Symbol.for('OfferController'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  JwtMiddleware: Symbol.for('JwtMiddleware'),
} as const;
