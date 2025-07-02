import { Global, Injectable, Module } from '@nestjs/common';
import * as Nest from '@nestjs/config';

@Injectable()
export class ConfigService extends Nest.ConfigService {
  get PORT() {
    return this.get<string>('PORT');
  }

  get DB_CONNECTION_OBJECT() {
    return {
      host: this.getOrThrow<string>('DB_HOST'),
      port: +this.getOrThrow('DB_PORT')!,
      username: this.getOrThrow<string>('DB_USERNAME'),
      password: this.getOrThrow<string>('DB_PASSWORD'),
      database: this.getOrThrow<string>('DB_NAME'),
    };
  }

  get JWT_OBJECT() {
    return {
      secret: this.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.getOrThrow<string>('JWT_EXPIRES_IN'),
    };
  }

  get ADMIN_USER() {
    return {
      email: this.getOrThrow<string>('ADMIN_USER_EMAIL'),
      password: this.getOrThrow<string>('ADMIN_USER_PASSWORD'),
    };
  }
}

@Global()
@Module({
  imports: [Nest.ConfigModule.forRoot()],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
