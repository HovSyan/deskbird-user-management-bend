import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ROLES } from 'src/constants';

@UseGuards(AuthGuard)
@Controller('/api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id')
  @UseGuards(RolesGuard(ROLES.ADMIN))
  updateOne(@Param('id') id: User['id'], @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
