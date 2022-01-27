import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export default class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    username: string

    @Column()
    firstname: string

    @Column()
    surname: string

    @Column()
    email: string

    @Column()
    password: string
}