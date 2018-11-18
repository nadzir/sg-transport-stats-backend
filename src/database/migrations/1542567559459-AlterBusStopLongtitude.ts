/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterBusStopLongtitude1542567559459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `bus_stop` CHANGE `Longitude` `longitude` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `bus_stop` CHANGE `longitude` `Longitude` varchar(255) NOT NULL");
    }

}
