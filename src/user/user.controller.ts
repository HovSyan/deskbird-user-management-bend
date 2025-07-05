import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ROLES } from 'src/constants';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('/api/v1/user')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get('me')
    getMe(@Req() request: Request) {
        const userId = request.jwt_payload!.sub.id;
        return this._userService.findById(userId);
    }

    @Get()
    findAll() {
        return this._userService.findAll();
    }

    @HttpCode(HttpStatus.OK)
    @Post(':id')
    @UseGuards(RolesGuard(ROLES.ADMIN))
    updateOne(@Param('id') id: User['id'], @Body() updateUserDto: UpdateUserDto) {
        return this._userService.update(id, updateUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @UseGuards(RolesGuard(ROLES.ADMIN))
    deleteOne(@Param('id') id: User['id']) {
        return this._userService.delete(id);
    }
}
