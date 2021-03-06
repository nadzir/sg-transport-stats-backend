import { EntityRepository, Repository } from 'typeorm';

import { PassengerVol } from '../models/PassengerVol';

@EntityRepository(PassengerVol)
export class PassengerVolRepository extends Repository<PassengerVol> {

    public findWithLocation(): Promise<PassengerVol[]> {
        return this.createQueryBuilder('passengerVol')
            .select()
            .leftJoinAndSelect('passengerVol.originPtCode', 'originPtCode')
            .leftJoinAndSelect('passengerVol.destinationPtCode', 'destinationPtCode')
            .orderBy('passengerVol.timePerHour', 'ASC')
            // .orderBy('passengerVol.totalTrips', 'DESC')
            .where('passengerVol.totalTrips > :trips', { trips: '50' })
            // .take(100)
            .getMany();
    }
}
