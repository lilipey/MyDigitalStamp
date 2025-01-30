import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738231386798 implements MigrationInterface {
    name = 'Migration1738231386798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`data\` blob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`data\``);
    }

}
