import * as Joi from 'joi';
import { ENVIRONMENT } from './enums/app.env';

/**
 * To getting a configuration in your class need to do:
 * 1. In a feature module import the configuration module:
 * @Module({
 *   imports: [ConfigModule],
 * })
 *
 * 2. In a feature class inject the config service:
 * constructor(private configService: ConfigService) {}
 *
 * 3. Call something that: this.configService.get<string>('database.name')
 */
export const configuration = () => ({
  database: {
    name:
      process.env.NODE_ENV === ENVIRONMENT.TEST
        ? `${process.env.DB_DATABASE_NAME}-test`
        : process.env.DB_DATABASE_NAME,
    uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
  },
  jwt: {
    secret: process.env.SECRET_KEY,
    expiresInSeconds: 60 * 60 * 24 * 365, // Seconds. 3600 is 1 hour.
  },
  cloudProvider: {
    name: process.env.CLOUD_STORAGE_PROVIDER,
    awsConfig: {
      credentials: {
        accessKeyId:
          process.env.AWS_ACCESS_KEY_ID ||
          'you have to define process.env.AWS_ACCESS_KEY_ID',
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY ||
          'you have to define process.env.AWS_SECRET_ACCESS_KEY',
      },
      region:
        process.env.AWS_REGION || 'you have to define process.env.AWS_REGION',
      bucketName:
        process.env.AWS_BUCKET_NAME ||
        'you have to define process.env.AWS_BUCKET_NAME',
    },
    gcpConfig: {
      bucket:
        process.env.GPC_BUCKET || 'you have to define process.env.GPC_BUCKET',
      projectId:
        process.env.GPC_PROJECT_ID ||
        'you have to define process.env.GPC_PROJECT_ID',
    },
  },
});

/**
 * Check that configuration was loaded successful or throw exception during starting.
 */
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .lowercase()
    .valid(ENVIRONMENT.DEV, ENVIRONMENT.PRODUCTION, ENVIRONMENT.TEST)
    .default(ENVIRONMENT.DEV),
  PORT: Joi.number().default(3000),
});
