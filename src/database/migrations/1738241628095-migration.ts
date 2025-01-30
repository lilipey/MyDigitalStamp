import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738241628095 implements MigrationInterface {
    name = 'Migration1738241628095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`certificate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`originalFilename\` varchar(255) NOT NULL, \`originalPath\` varchar(255) NOT NULL, \`modifiedPath\` varchar(255) NOT NULL, \`verificationCount\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`data\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`path\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`original_file_path\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`stamped_file_path\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`certificate\` ADD CONSTRAINT \`FK_52422eba9e5b9d779d3e173a25d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificate\` DROP FOREIGN KEY \`FK_52422eba9e5b9d779d3e173a25d\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`stamped_file_path\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`original_file_path\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`path\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`data\` longblob NOT NULL`);
        await queryRunner.query(`DROP TABLE \`certificate\``);
    }

}
