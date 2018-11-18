import {
    Get, JsonController,
} from 'routing-controllers';

import {PassengerVolService} from '../services/PassengerVol';

// @Authorized()
@JsonController('/passengerVol')
export class PassengerVolController {

    constructor(
        private passengerVolService: PassengerVolService
    ) { }

    @Get('/update')
    public async update(): Promise<string> {
        const dataDir = 'data/passengerVol';
        const zipFile = 'data/tmp/passengerVol.zip';

       this.passengerVolService.downloadZipFile(zipFile);
       this.passengerVolService.unzipFile(zipFile, dataDir);

        return Promise.resolve('hi');
    }

}
