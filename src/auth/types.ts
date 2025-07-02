import type { User } from 'src/user/entities/user.entity';

export type JwtPayload = {
  sub: User['id'];
};
