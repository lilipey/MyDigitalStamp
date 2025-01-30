import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738250442211 implements MigrationInterface {
    name = 'Migration1738250442211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`file\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    }

}
