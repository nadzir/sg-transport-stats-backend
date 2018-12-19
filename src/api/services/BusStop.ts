import { Service } from 'typedi';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import axios from 'axios';
import { BusStopRepository } from '../repositories/BusStopRepository';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { getOsEnv } from '../../lib/env/utils';
import { BusStop } from '../models/BusStop';
import fs from 'fs';

@Service()
export class BusStopService {

    constructor(
        @OrmRepository() private busStopRepository: BusStopRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async update(index: number): Promise<void> {
        const response = await axios({
            method: 'get',
            url: `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${index * 500}`,
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

    public async updateFromJson(): Promise<void> {
        const busStopJsonFile = 'data/busStop/busStop.json';
        const busStops = JSON.parse(fs.readFileSync(busStopJsonFile, 'utf8'));
        Object.keys(busStops).forEach(key => {
            const _busStop = busStops[key];

            const busStop = new BusStop();
            busStop.busStopCode = key;
            busStop.description = _busStop.name;
            busStop.latitude = _busStop.coords.split(',')[0];
            busStop.longitude = _busStop.coords.split(',')[1];

            this.log.info(`Updating bus stop: ${busStop.busStopCode}`);
            this.busStopRepository.save(busStop);
        });
        this.log.info(`Updated bus stops`);
    }

    public async getBusStopDetail(busStopCode: string): Promise<BusStop> {
        const busStops = await this.busStopRepository.find({
            where: {
                busStopCode,
            },
        });
        return busStops[0];
    }

    public findOne(busStopCode: string): Promise<BusStop | undefined> {
        this.log.info('Find bus stop');
        return this.busStopRepository.findOne({ busStopCode });
    }
}
