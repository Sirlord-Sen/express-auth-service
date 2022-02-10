import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    BaseEntity, 
    Unique, 
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm'

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}