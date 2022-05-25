import { Entity, Column, JoinColumn, OneToOne, Unique, Index } from 'typeorm';

import { EntityCore } from '@core//';
import { IPlatform } from '../interfaces';
import { PlatformNetwork } from '../platform.types';
import { UserEntity } from '@user-module/entity'

@Entity({ name: "platforms" })
@Unique("UQ_PLATFORM_SSID", ['ssid'])
export default class PlatformEntity extends EntityCore<IPlatform> implements IPlatform {
    @Column('enum', { enum: PlatformNetwork })
    name!: PlatformNetwork;

    @Column('varchar')
    ssid!: string;

    @Column('text', { nullable: true })
    url?: string;

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Index()
    @Column('uuid', { unique: true })
    userId!: string;
}