import { EntityRepository, Repository } from 'typeorm';

import { BusStop } from '../models/BusStop';

@EntityRepository(BusStop)
export class BusStopRepository extends Repository<BusStop> {

}
