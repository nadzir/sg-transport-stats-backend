import { IsNotEmpty } from 'class-validator';
import {Column, Entity, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm';
import { BusStop } from './BusStop';

@Entity()
export class PassengerVol {

    @IsNotEmpty()
    @PrimaryColumn({
        name: 'year_month',
    })
    public yearMonth: string;

    @IsNotEmpty()
    @PrimaryColumn({
        name: 'day_type',
    })
    public dayType: string;

    @IsNotEmpty()
    @PrimaryColumn({
        name: 'time_per_hour',
    })
    public timePerHour: string;

    @IsNotEmpty()
    @PrimaryColumn({
        name: 'pt_type',
    })
    public ptType: string;

    @IsNotEmpty()
    @PrimaryColumn({
        name: 'origin_pt_code',
    })
    @ManyToOne(type => BusStop, busStop => busStop.busStopCode)
    @JoinColumn({ name: 'origin_pt_code' })
    public originPtCode: string;

    @IsNotEmpty()
    @PrimaryColumn({
        name: 'destination_pt_code',
    })
    @ManyToOne(type => BusStop, busStop => busStop.busStopCode)
    @JoinColumn({ name: 'destination_pt_code' })
    public destinationPtCode: string;

    @IsNotEmpty()
    @Column({
        name: 'total_trips',
    })
    public totalTrips: string;

    @Column({nullable: true})
    public polyline: string;
}
