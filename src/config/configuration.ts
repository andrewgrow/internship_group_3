import * as Joi from 'joi';

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
      process.env.NODE_ENV === 'test'
        ? `${process.env.DB_DATABASE_NAME}-test`
        : process.env.DB_DATABASE_NAME,
    uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
  },
  jwt: {
    secret: process.env.SECRET_KEY,
    expiresInSeconds: 60 * 60 * 24 * 365, // Seconds. 3600 is 1 hour.
  },
});

/**
 * Check that configuration was loaded successful or throw exception during starting.
 */
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .lowercase()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
});
