import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRole {
    static factory(partial: Partial<UserRole>) {
        return Object.assign(new UserRole(), partial);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
