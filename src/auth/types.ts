import type { UserRole } from 'src/user/entities/role.entity';
import type { User } from 'src/user/entities/user.entity';

export type JwtPayload = {
  sub: {
    id: User['id'];
    role: UserRole['id'];
  };
};
