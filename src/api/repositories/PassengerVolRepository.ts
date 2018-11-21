import { EntityRepository, Repository } from 'typeorm';

import { PassengerVol } from '../models/PassengerVol';

@EntityRepository(PassengerVol)
export class PassengerVolRepository extends Repository<PassengerVol> {

    public findWithLocation(): Promise<PassengerVol[]> {
        return this.createQueryBuilder('passengerVol')
        .select()
        .leftJoinAndSelect('passengerVol.originPtCode', 'originPtCode')
        .leftJoinAndSelect('passengerVol.destinationPtCode', 'destinationPtCode')
        .getMany();
    }
}
