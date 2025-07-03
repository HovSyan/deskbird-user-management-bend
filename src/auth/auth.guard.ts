import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '../app.config';
import { JwtPayload } from './types';
import { ACCESS_TOKEN } from 'src/constants';

declare global {
    namespace Express {
        interface Request {
            jwt_payload?: JwtPayload;
        }
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private _jwtService: JwtService,
        private _configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies[ACCESS_TOKEN] as string | undefined;

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this._jwtService.verifyAsync<JwtPayload>(token, {
                secret: this._configService.JWT_OBJECT.secret,
            });
            request.jwt_payload = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}
