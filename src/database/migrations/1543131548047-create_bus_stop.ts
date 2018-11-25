/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class createBusStop1543131548047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `bus_stop` (`bus_stop_code` varchar(255) NOT NULL, `road_name` varchar(255) NULL, `description` varchar(255) NULL, `latitude` varchar(255) NOT NULL, `longitude` varchar(255) NOT NULL, PRIMARY KEY (`bus_stop_code`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `bus_stop`");
    }

}
