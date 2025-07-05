import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PASSWORD_HASH_SALT_ROUND, ROLES } from 'src/constants';
import { UserRole } from './entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private _repo: Repository<User>) {}

    async create(dto: CreateUserDto) {
        await this._assertUniqueEmailConstraint(undefined, dto.email);
        const role = Object.assign(new UserRole(), { id: ROLES.REGULAR });
        const password = await bcrypt.hash(dto.password, PASSWORD_HASH_SALT_ROUND);
        const user = Object.assign(new User(), {
            ...dto,
            role,
            password,
        });
        return void (await this._repo.insert(user));
    }

    async update(id: User['id'], dto: UpdateUserDto) {
        await this._assertUniqueEmailConstraint(id, dto.email);
        const result = await this._repo.update({ id }, dto);
        if (result.affected === 0) {
            throw new NotFoundException(this._notFoundExceptionMessage(id));
        }
    }

    async delete(id: User['id']) {
        const result = await this._repo.delete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(this._notFoundExceptionMessage(id));
        }
    }

    findAll() {
        return this._repo.find();
    }

    findById(id: string) {
        return this._repo.findOneBy({ id });
    }

    findByEmail(email: string) {
        return this._repo.findOneBy({ email });
    }

    findByEmailWithCredentials(email: string) {
        return this._repo.findOne({
            where: { email },
            select: this._repo.metadata.columns.map((col) => col.propertyName as keyof User),
        });
    }

    private _notFoundExceptionMessage(id: User['id']) {
        return `A user with ${id} not found`;
    }

    private async _assertUniqueEmailConstraint(id?: User['id'], email?: string) {
        if (!email) return;
        const exists = await this._repo.findOneBy({ email });
        if (!exists) return;
        if (exists.id !== id) throw new BadRequestException('Email already exists');
    }
}
