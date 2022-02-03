import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique, BeforeInsert, BeforeUpdate } from 'typeorm'
import argon2 from 'argon2'

@Entity({name: "users"})
@Unique('UQ_USER_EMAIL', ['email'])
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

    @Column('text', { nullable: true })
    confirmTokenPassword?: string;

    // @BeforeInsert()
    // @BeforeUpdate()
    // async hashPassword(){
    //     this.password = await argon2.hash(this.password)
    // }

}