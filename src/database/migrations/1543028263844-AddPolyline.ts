import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPolyline1543028263844 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` ADD `polyline` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `passenger_vol` DROP COLUMN `polyline`");
    }

}
