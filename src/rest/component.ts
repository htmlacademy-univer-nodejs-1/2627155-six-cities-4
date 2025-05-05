export const Component = {
  RestApplication: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  OfferRepository: Symbol.for('OfferRepository'),
  UserRepository: Symbol.for('UserRepository'),
} as const;
