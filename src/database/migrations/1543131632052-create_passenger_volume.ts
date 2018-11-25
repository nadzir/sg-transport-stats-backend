/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class createPassengerVolume1543131632052 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `passenger_vol` (`year_month` varchar(255) NOT NULL, `day_type` varchar(255) NOT NULL, `time_per_hour` int NOT NULL, `pt_type` varchar(255) NOT NULL, `origin_pt_code` varchar(255) NOT NULL, `destination_pt_code` varchar(255) NOT NULL, `total_trips` int NOT NULL, `polyline` varchar(1000) NULL, PRIMARY KEY (`year_month`, `day_type`, `time_per_hour`, `pt_type`, `origin_pt_code`, `destination_pt_code`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `passenger_vol` ADD CONSTRAINT `FK_3c4efc418df6497472c057dda32` FOREIGN KEY (`origin_pt_code`) REFERENCES `bus_stop`(`bus_stop_code`)");
        await queryRunner.query("ALTER TABLE `passenger_vol` ADD CONSTRAINT `FK_979a2f5aa0aadc7f39c6618cb2d` FOREIGN KEY (`destination_pt_code`) REFERENCES `bus_stop`(`bus_stop_code`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` DROP FOREIGN KEY `FK_979a2f5aa0aadc7f39c6618cb2d`");
        await queryRunner.query("ALTER TABLE `passenger_vol` DROP FOREIGN KEY `FK_3c4efc418df6497472c057dda32`");
        await queryRunner.query("DROP TABLE `passenger_vol`");
    }

}
