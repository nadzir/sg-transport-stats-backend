import {
    Get, JsonController,
} from 'routing-controllers';

import { BusStopService } from '../services/BusStop';

// @Authorized()
@JsonController('/BusStop')
export class BusStopController {

    constructor(
        private busStopService: BusStopService
    ) { }

    @Get('/update')
    public async update(): Promise<string> {
        // this.busStopService.update();
        this.busStopService.updateFromJson();
        return Promise.resolve('hi');
    }
}
