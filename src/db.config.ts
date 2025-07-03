import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserRole } from './user/entities/role.entity';
import { ConfigModule, ConfigService } from './app.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private _configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            entities: [User, UserRole],
            synchronize: true,
            logging: ['error'],
            ssl: this._configService.IS_PRODUCTION,
            ...this._configService.DB_CONNECTION_OBJECT,
        };
    }
}

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
        }),
    ],
})
export class DBConnectionModule {}
