import { Column, Entity, Index, ManyToOne, JoinColumn} from 'typeorm'
import UserEntity from '@modules/user/entity/user.entity';
import EntityCore from '@core/entity.core';
import { IRefreshToken } from '../interfaces';

@Entity('refresh_tokens')
export default class RefreshTokenEntity extends EntityCore<IRefreshToken> implements IRefreshToken{
    @Column('text', { nullable: true })
    browser!: string;

    @Column('timestamptz')
    expiredAt!: Date;

    @Column('cidr', { nullable: true })
    ip!: string;

    @Column('boolean', { default: false })
    isRevoked = false;

    @Index()
    @Column('varchar')
    jti!: string;

    @Column('text', { nullable: true })
    os!: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column('text', { nullable: true })
    userAgent!: string;

    @Index()
    @Column('uuid')
    userId!: string;
}