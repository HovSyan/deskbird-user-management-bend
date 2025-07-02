import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private _repo: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = createUserDto.password;
    // TODO: fix
    user.role = 2 as unknown as string;
    return this._repo.save(user);
  }

  findAll() {
    return this._repo.find({ relations: ['role'] });
  }

  findByEmail(email: string) {
    return this._repo.findOneBy({ email });
  }

  // TODO: mb better way?
  findCredentialsByEmail(email: string) {
    return this._repo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    }) as Promise<Required<Pick<User, 'id' | 'email' | 'password' | 'role'>>>;
  }
}
