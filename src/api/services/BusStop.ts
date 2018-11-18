import { Service } from 'typedi';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import axios from 'axios';
import { BusStopRepository } from '../repositories/BusStopRepository';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { getOsEnv } from '../../lib/env/utils';
import { BusStop } from '../models/BusStop';

@Service()
export class BusStopService {

    constructor(
        @OrmRepository() private busStopRepository: BusStopRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async update(): Promise<void> {
        const response = await axios({
            method: 'get',
            url: 'http://datamall2.mytransport.sg/ltaodataservice/BusStops',
            headers: {
                Accountkey: getOsEnv('LTA_ACCOUNT_KEY'),
            },
        });
        const busStops = response.data.value;
        busStops.forEach(_busStop => {

            const busStop = new BusStop();
            busStop.busStopCode = _busStop.BusStopCode;
            busStop.roadName = _busStop.RoadName;
            busStop.description = _busStop.Description;
            busStop.latitude = _busStop.Latitude;
            busStop.longitude = _busStop.Longitude;

            this.log.info(`Updating bus stop: ${busStop.busStopCode}`);
            this.busStopRepository.save(busStop);
        });
        this.log.info(`Updated bus stops`);
    }
}
