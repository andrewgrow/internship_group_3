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
export default () => ({
  database: {
    name:
      process.env.NODE_ENV === 'test'
        ? `${process.env.DB_DATABASE_NAME}-test`
        : process.env.DB_DATABASE_NAME,
  },
});
