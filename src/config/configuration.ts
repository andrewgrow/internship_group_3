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
