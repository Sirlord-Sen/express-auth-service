import EntityCore from '@core/entity.core'
import { 
    Entity, 
    Column,
    Unique,
    OneToOne
} from 'typeorm'
import { IUser } from '../interfaces/user.interface'
import ProfileEntity from './profile.entity'

@Entity({name: "users"})
@Unique('UQ_USER_EMAIL', ['email'])
export default class UserEntity extends EntityCore<IUser> implements IUser{
    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: false })
    isActive?: boolean;

    @Column({ default: false })
    isAccountActivated?: boolean

    @Column({ nullable: true })
    accountActivationToken?: string;

    @Column({ nullable: true })
    accountActivationExpires?: Date;

    @Column('text', { nullable: true })
    passwordResetToken?: string;

    @Column({ nullable: true })
    passwordResetExpires?: Date;

    @OneToOne(() => ProfileEntity, (profile) => profile.user, {
        eager: true,
        cascade: true,
      })
    profile!: ProfileEntity;
}