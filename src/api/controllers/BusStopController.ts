import {
    Get, JsonController, OnUndefined, Param,
} from 'routing-controllers';
import { times } from 'lodash';

import { BusStopService } from '../services/BusStop';
import {BusNotFoundError} from '../errors/BusNotFoundError';
import { BusStop } from '../models/BusStop';

// @Authorized()
@JsonController('/busStop')
export class BusStopController {

    constructor(
        private busStopService: BusStopService
    ) { }

    @Get('/:busStopCode')
    @OnUndefined(BusNotFoundError)
    public one(@Param('busStopCode') busStopCode: string): Promise<BusStop | undefined> {
        return this.busStopService.findOne(busStopCode);
    }

    @Get('/update')
    public async update(): Promise<string> {
        const arr = times(150, Number);
        arr.forEach((index) => {
            console.log(index);
            setTimeout(() => {
                this.busStopService.update(index);
            }, 500 * index);
        });
        return Promise.resolve('Updating bus stop');
    }
}
