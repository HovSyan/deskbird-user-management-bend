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

  async signIn(email: string, pass: string) {
    const user = await this.userService.findByEmailWithCredentials(email);
    const match = await (!!user && bcrypt.compare(pass, user.password!));
    if (!match || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.password;
    const payload: JwtPayload = { sub: { id: user.id, role: user.role.id } };
    return {
      user,
      [ACCESS_TOKEN]: await this.jwtService.signAsync(payload),
    };
  }
}
