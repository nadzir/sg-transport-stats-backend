/* tslint:disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePassengerVol1542292342826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `passenger_vol` (`id` varchar(255) NOT NULL, `year_month` varchar(255) NOT NULL, `day_type` varchar(255) NOT NULL, `time_per_hour` varchar(255) NOT NULL, `pt_type` varchar(255) NOT NULL, `origin_pt_code` varchar(255) NOT NULL, `destination_pt_code` varchar(255) NOT NULL, `total_trips` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `passenger_vol`');
    }

}
