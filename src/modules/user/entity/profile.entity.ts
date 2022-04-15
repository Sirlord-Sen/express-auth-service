import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { EntityCore } from '@core//';
import { IProfile } from '../interfaces';
import UserEntity from './user.entity';
import { Gender } from '@utils/utility-types';

@Entity({ name: "profiles" })
export default class ProfileEntity extends EntityCore<IProfile> implements IProfile {
  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column('enum', { enum: Gender })
  gender: Gender

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column('uuid', { unique: true })
  userId!: string;

  @Column("varchar", { nullable: true })
  picture?: string;

  public get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}