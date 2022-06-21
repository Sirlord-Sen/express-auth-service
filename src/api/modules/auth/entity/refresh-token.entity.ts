import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm'

import { EntityCore } from '@core/';
import { UserEntity } from '@user-module/entity';
import { IRefreshToken } from '../interfaces';

@Entity('refresh_tokens')
export default class RefreshTokenEntity extends EntityCore<IRefreshToken> implements IRefreshToken{
    @Column('text', { nullable: true })
    browser!: string;

    @Column('timestamptz')
    expiresAt!: Date;

    @Column('cidr', { nullable: true })
    ip!: string;

    @Column('boolean', { default: false })
    isRevoked: boolean;

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