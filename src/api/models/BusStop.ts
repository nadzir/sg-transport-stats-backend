import { IsNotEmpty } from 'class-validator';
import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class BusStop {

    @PrimaryColumn({
        name: 'bus_stop_code',
    })
    public busStopCode: string;

    @Column({
        name: 'road_name',
        nullable: true,
    })
    public roadName: string;

    @Column({
        nullable: true,
    })
    public description: string;

    @IsNotEmpty()
    @Column()
    public latitude: string;

    @IsNotEmpty()
    @Column()
    public longitude: string;
}
