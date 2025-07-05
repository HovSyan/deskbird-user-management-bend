import { Body, Controller, Post, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { ACCESS_TOKEN, COOKIE_OPTIONS, ROLES } from 'src/constants';
import { tomorrow } from 'src/utils';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private _authService: AuthService,
        private _userService: UserService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() { email, password }: SignInDto, @Res() response: Response) {
        const { user, token } = await this._authService.signIn(email, password);
        response.cookie(ACCESS_TOKEN, token, {
            expires: tomorrow(),
            ...COOKIE_OPTIONS,
        });
        return response.json(user);
    }

    @Post('logout')
    logout(@Res() response: Response) {
        return response.clearCookie(ACCESS_TOKEN, COOKIE_OPTIONS).status(HttpStatus.OK).send();
    }

    @Post('register')
    @UseGuards(
        /**
         * This is intentional - only authorized admins can register (aka create) users
         */
        AuthGuard,
        RolesGuard(ROLES.ADMIN),
    )
    signUp(@Body() dto: SignUpDto) {
        return this._userService.create(dto);
    }
}
