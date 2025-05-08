export const Component = {
  RestApplication: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  CommentRepository: Symbol.for('CommentRepository'),
  OfferRepository: Symbol.for('OfferRepository'),
  UserRepository: Symbol.for('UserRepository')
} as const;
