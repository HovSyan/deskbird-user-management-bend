import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserSeederService from './user.seeder';
import { UserRole } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  controllers: [UserController],
  providers: [UserService, UserSeederService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(private _seeder: UserSeederService) {}

  async onModuleInit() {
    await this._seeder.exec();
  }
}
