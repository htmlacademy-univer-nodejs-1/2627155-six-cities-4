import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  HOST: string;
  PORT: number;
  SALT: string;
  MONGO_URL: string;
  JWT_SECRET: string;
  UPLOADS_DIR: string;
}

export const configRestSchema = convict<RestSchema>({
  HOST: {
    doc: 'Host for incoming connections',
    format: 'ipaddress',
    env: 'HOST',
    default: '127.0.0.1'
  },
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  MONGO_URL : {
    doc: 'MongoDB connection link',
    format: String,
    env: 'MONGO_URL',
    default: null
  },
  JWT_SECRET: {
    doc: 'JWT secret',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  UPLOADS_DIR: {
    doc: 'Path to user uploaded static files',
    format: String,
    env: 'UPLOADS_DIR',
    default: '.uploads/'
  }
});
