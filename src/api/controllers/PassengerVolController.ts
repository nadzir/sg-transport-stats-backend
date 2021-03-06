import {
    Get, JsonController,
} from 'routing-controllers';

import {PassengerVolService} from '../services/PassengerVol';
import { PassengerVol } from '../models/PassengerVol';

// @Authorized()
@JsonController('/passengerVol')
export class PassengerVolController {

    constructor(
        private passengerVolService: PassengerVolService
    ) { }

    @Get ('/')
    public async getAll(): Promise<PassengerVol[]> {
        return this.passengerVolService.find();
    }

    @Get('/update')
    public async update(): Promise<string> {
        const dataDir = 'data/passengerVol';
        // const zipFile = 'data/passengerVol.zip';

    //    await this.passengerVolService.downloadZipFile(zipFile);
    //    await this.passengerVolService.unzipFile(zipFile, dataDir);
       this.passengerVolService.update(dataDir);

        return Promise.resolve('updating passenger volume');
    }

}
