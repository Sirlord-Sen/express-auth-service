import { Entity, Column, JoinColumn, ManyToOne, Unique, Index } from 'typeorm';
import UserEntity from '@modules/user/entity/user.entity';

import { IPlatform } from '../interfaces';
import { PlatformNetwork } from '../platform.types';
import EntityCore from '@core/entity.core';

@Entity({ name: "platforms" })
@Unique("UQ_PLATFORM_SSID", ['ssid'])
export default class PlatformEntity extends EntityCore<IPlatform> implements IPlatform {
    @Column('enum', { enum: PlatformNetwork })
    name!: PlatformNetwork;

    @Column('varchar')
    ssid!: string;

    @Column('text', { nullable: true })
    url?: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Index()
    @Column('uuid', { unique: true })
    userId!: string;
}