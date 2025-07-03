import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { ACCESS_TOKEN } from 'src/constants';
import { tomorrow } from 'src/utils';

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
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return response.json(user);
  }

  @Post('register')
  signUp(@Body() dto: SignUpDto) {
    return this._userService.create(dto);
  }
}
