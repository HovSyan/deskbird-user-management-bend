import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types';
import { ACCESS_TOKEN } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.userService.findByEmailWithCredentials(username);
    const match = await (!!user && bcrypt.compare(pass, user.password!));
    if (!match || !user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    const payload: JwtPayload = { sub: user.id };
    return {
      user,
      [ACCESS_TOKEN]: await this.jwtService.signAsync(payload),
    };
  }
}
