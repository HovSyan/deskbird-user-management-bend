import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PASSWORD_HASH_SALT_ROUND, ROLES } from 'src/constants';
import { UserRole } from './entities/role.entity';
import { ConfigService } from 'src/app.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UserSeederService {
  constructor(
    @InjectRepository(User) private _userRepo: Repository<User>,
    @InjectRepository(UserRole) private _rolesRepo: Repository<UserRole>,
    private _configService: ConfigService,
  ) {}

  public async exec() {
    await this._seedRoles();
    await this._seedUsers();
  }

  private async _seedRoles() {
    await this._rolesRepo.save([
      UserRole.factory({ id: 1, name: 'admin' }),
      UserRole.factory({ id: 2, name: 'regular' }),
    ]);
  }

  private async _seedUsers() {
    let admin = await this._userRepo.findOneBy({ role: { id: ROLES.ADMIN } });
    if (admin) return;

    const { email, password } = this._configService.ADMIN_USER;
    admin = User.factory({
      email,
      role: UserRole.factory({ id: ROLES.ADMIN }),
      firstName: 'admin',
      lastName: '',
      password: await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUND),
    });

    await this._userRepo.insert(admin);
  }
}
