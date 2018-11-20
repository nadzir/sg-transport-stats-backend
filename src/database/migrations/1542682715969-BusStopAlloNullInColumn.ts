/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class BusStopAlloNullInColumn1542682715969 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `bus_stop` CHANGE `road_name` `road_name` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `bus_stop` CHANGE `description` `description` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `bus_stop` CHANGE `description` `description` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `bus_stop` CHANGE `road_name` `road_name` varchar(255) NOT NULL");
    }

}
