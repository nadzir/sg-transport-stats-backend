import {
    Get, JsonController,
} from 'routing-controllers';
import { times } from 'lodash';

import { BusStopService } from '../services/BusStop';

// @Authorized()
@JsonController('/busStop')
export class BusStopController {

    constructor(
        private busStopService: BusStopService
    ) { }

    @Get('/update')
    public async update(): Promise<string> {
        const arr = times(150, Number);
        arr.forEach((_, index) => {
            console.log(index);
            this.busStopService.update(index);
        });

        // this.busStopService.updateFromJson();
        return Promise.resolve('hi');
    }
}
