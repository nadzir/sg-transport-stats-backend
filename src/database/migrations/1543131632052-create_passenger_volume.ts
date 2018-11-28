/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class createPassengerVolume1543131632052 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `passenger_vol` (`year_month` varchar(255) NOT NULL, `day_type` varchar(255) NOT NULL, `time_per_hour` int NOT NULL, `pt_type` varchar(255) NOT NULL, `origin_pt_code` varchar(255) NOT NULL, `destination_pt_code` varchar(255) NOT NULL, `total_trips` int NOT NULL, `polyline` varchar(1000) NULL, PRIMARY KEY (`year_month`, `day_type`, `time_per_hour`, `pt_type`, `origin_pt_code`, `destination_pt_code`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `passenger_vol`");
    }

}
