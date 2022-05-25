import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from "typeorm";

import { PlatformNetwork } from "@platform-module/platform.types";

export class Platform1629959478561 implements MigrationInterface{
    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('platforms')
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'platforms',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'name',
                        type: 'enum',
                        enum: Object.values(PlatformNetwork)
                    },
                    {
                        name: 'ssid',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'url',
                        type: 'text',
                        isNullable: true
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isUnique: true,
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
        )

        await queryRunner.createUniqueConstraint(
            'platforms',
            new TableUnique({
                name: 'platforms',
                columnNames: ['ssid']
            })
        );

        await queryRunner.createForeignKey(
            'platforms',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createIndex('platforms',
            new TableIndex({
                columnNames: ['userId']
            }),
        );
    }
}