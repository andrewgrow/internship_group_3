import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './security/auth/auth.module';
import { AppConfigModule } from './config/app.config.module';

@Module({
  imports: [AppConfigModule, UsersModule, AuthModule],
})
export class AppModule {}
