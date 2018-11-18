import { IsNotEmpty } from 'class-validator';
import { Column, Entity,  PrimaryColumn } from 'typeorm';

@Entity()
export class PassengerVol {

    @PrimaryColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column({
        name: 'year_month',
    })
    public yearMonth: string;

    @IsNotEmpty()
    @Column({
        name: 'day_type',
    })
    public dayType: string;

    @IsNotEmpty()
    @Column({
        name: 'time_per_hour',
    })
    public timePerHour: string;

    @IsNotEmpty()
    @Column({
        name: 'pt_type',
    })
    public ptType: string;

    @IsNotEmpty()
    @Column({
        name: 'origin_pt_code',
    })
    public originPtCode: string;

    @IsNotEmpty()
    @Column({
        name: 'destination_pt_code',
    })
    public destinationPtCode: string;

    @IsNotEmpty()
    @Column({
        name: 'total_trips',
    })
    public totalTrips: string;
}
