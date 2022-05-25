import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

import { Gender } from "@utils/utility-types";

export class Profile1629959478561 implements MigrationInterface{
    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('profiles')
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'profiles',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'firstname',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'lastname',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'gender',
                        type: 'enum',
                        enum: Object.values(Gender),
                        isNullable: true
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isUnique: true,
                    },
                    {
                        name: 'picture',
                        type: 'varchar',
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
        )
    }
}