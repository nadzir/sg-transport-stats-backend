import { EntityRepository, Repository } from 'typeorm';

import { PassengerVol } from '../models/PassengerVol';

@EntityRepository(PassengerVol)
export class PassengerVolRepository extends Repository<PassengerVol> {

}
