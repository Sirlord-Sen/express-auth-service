import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm'

export class User1629959478561 implements MigrationInterface{
    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('users')
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'users', 
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'isActive',
                        type: 'bool',
                        default: false,
                    },
                    {
                        name: 'isAccountActivated',
                        type: 'bool',
                        default: false,
                    },
                    {
                        name: 'accountActivationToken',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'accountActivationExpires',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'passwordResetToken',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'passwordResetExpires',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createUniqueConstraint(
            'users',
            new TableUnique({
                name: 'users',
                columnNames: ['email']
            })
        )
    }
}