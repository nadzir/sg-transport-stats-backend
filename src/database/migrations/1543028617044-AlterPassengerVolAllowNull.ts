import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterPassengerVolAllowNull1543028617044 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` CHANGE `polyline` `polyline` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` CHANGE `polyline` `polyline` varchar(255) NOT NULL");
    }

}
