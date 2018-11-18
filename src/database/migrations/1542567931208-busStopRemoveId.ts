/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class busStopRemoveId1542567931208 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `bus_stop` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `bus_stop` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `bus_stop` ADD PRIMARY KEY (`bus_stop_code`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `bus_stop` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `bus_stop` ADD `id` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `bus_stop` ADD PRIMARY KEY (`id`)");
    }

}
