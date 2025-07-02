import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PASSWORD_HASH_SALT_ROUND, ROLES } from 'src/constants';
import { UserRole } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private _repo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    const role = new UserRole();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = await bcrypt.hash(
      createUserDto.password,
      PASSWORD_HASH_SALT_ROUND,
    );
    role.id = ROLES.REGULAR;
    user.role = role;
    return void (await this._repo.insert(user));
  }

  findAll() {
    return this._repo.find();
  }

  findByEmail(email: string) {
    return this._repo.findOneBy({ email });
  }

  findByEmailWithCredentials(email: string) {
    return this._repo.findOne({
      where: { email },
      select: this._repo.metadata.columns.map(
        (col) => col.propertyName as keyof User,
      ),
    });
  }
}
