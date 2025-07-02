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
    @InjectRepository(User) private _repo: Repository<User>,
    private _configService: ConfigService,
  ) {}

  public async exec() {
    let admin = await this._repo.findOneBy({ role: { id: ROLES.ADMIN } });
    if (!admin) {
      const role = Object.assign(new UserRole(), { id: ROLES.ADMIN });
      const { email, password } = this._configService.ADMIN_USER;
      admin = Object.assign(new User(), {
        email,
        role,
        firstName: 'admin',
        lastName: '',
        password: await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUND),
      });

      await this._repo.insert(admin);
    }
  }
}
