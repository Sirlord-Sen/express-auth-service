import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class RefreshToken1629959478561 implements MigrationInterface{
    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('refresh_tokens')
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'refresh_tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'browser',
                        type: 'text',
                        isNullable: true
                    },
                    {
                        name: 'expiresAt',
                        type: 'timestamptz',
                    },
                    {
                        name: 'isRevoked',
                        type: 'bool',
                        default: false
                    },
                    {
                        name: 'jti',
                        type: 'varchar'
                    },
                    {
                        name: 'os',
                        type: 'text',
                        isNullable: true
                    },
                    {
                        name: 'userAgent',
                        type: 'text',
                        isNullable: true
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
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
                ]
            })
        );

        await queryRunner.createForeignKey(
            'profiles',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createIndices('refresh_tokens',[
            new TableIndex({
                columnNames: ['jti']
            }),
            new TableIndex({
                columnNames: ['userId']
            })
        ]);
    }
}