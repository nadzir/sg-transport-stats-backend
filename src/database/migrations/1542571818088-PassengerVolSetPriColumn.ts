/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class PassengerVolSetPriColumn1542571818088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `passenger_vol` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `passenger_vol` ADD PRIMARY KEY (`year_month`, `day_type`, `time_per_hour`, `pt_type`, `origin_pt_code`, `destination_pt_code`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `passenger_vol` ADD `id` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `passenger_vol` ADD PRIMARY KEY (`id`)");
    }

}
