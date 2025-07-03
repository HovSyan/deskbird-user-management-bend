import { Injectable } from '@nestjs/common';
import * as Nest from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '../app.config';

@Injectable()
export class JwtConfigService implements Nest.JwtOptionsFactory {
    constructor(private _configService: ConfigService) {}

    createJwtOptions() {
        const { secret, expiresIn } = this._configService.JWT_OBJECT;
        return { global: true, secret, signOptions: { expiresIn } };
    }
}

export const JwtModule = Nest.JwtModule.registerAsync({
    global: true,
    imports: [ConfigModule],
    useClass: JwtConfigService,
});
