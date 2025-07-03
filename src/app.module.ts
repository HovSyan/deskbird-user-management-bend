import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DBConnectionModule } from './db.config';
import { ConfigModule } from './app.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigModule, DBConnectionModule, UserModule, AuthModule, HealthModule],
})
export class AppModule {}
