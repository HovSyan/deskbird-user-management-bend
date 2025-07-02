import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findCredentialsByEmail(username);
    const match = await (!!user && bcrypt.compare(pass, user.password));
    if (!match) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
      } as JwtPayload),
    };
  }
}
