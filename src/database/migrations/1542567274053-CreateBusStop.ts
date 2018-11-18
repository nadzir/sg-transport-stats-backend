/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBusStop1542567274053 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `bus_stop` (`id` varchar(255) NOT NULL, `bus_stop_code` varchar(255) NOT NULL, `road_name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `latitude` varchar(255) NOT NULL, `Longitude` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `bus_stop`");
    }

}
