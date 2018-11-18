import { IsNotEmpty } from 'class-validator';
import { Column, Entity,  PrimaryColumn } from 'typeorm';

@Entity()
export class BusStop {

    @PrimaryColumn({
        name: 'bus_stop_code',
    })
    public busStopCode: string;

    @IsNotEmpty()
    @Column({
        name: 'road_name',
    })
    public roadName: string;

    @IsNotEmpty()
    @Column()
    public description: string;

    @IsNotEmpty()
    @Column()
    public latitude: string;

    @IsNotEmpty()
    @Column()
    public longitude: string;
}
