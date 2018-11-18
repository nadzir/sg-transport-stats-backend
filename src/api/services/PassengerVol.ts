import { Service } from 'typedi';
import https from 'https';
import axios from 'axios';
import fs from 'fs';
import unzipper from 'unzipper';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { getOsEnv } from '../../lib/env/utils';

@Service()
export class PassengerVolService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async downloadZipFile(zipFile: string): Promise<void> {
        try {
            // Call the LTA api
            this.log.info('Getting LTA url link');
            const response = await axios({
                method: 'get',
                url: 'http://datamall2.mytransport.sg/ltaodataservice/PV/ODBus',
                headers: {
                    Accountkey: getOsEnv('LTA_ACCOUNT_KEY'),
                },
            });
            // Get the zip file
            const data = response.data.value[0];
            const link = data.Link;
            const file = fs.createWriteStream(zipFile);
            this.log.info('Obtained link : ');
            this.log.info(link);
            https.get(link, (resp) => {
                resp.pipe(file);
                Promise.resolve(true);
            });
        } catch (err) {
            this.log.error('Error in getting LTA passenger vol');
            this.log.error(err);
            Promise.resolve(false);
        }
    }

    public unzipFile(zipFile: string, dataDir: string): void {
        const readFile = fs.createReadStream(zipFile);
        readFile.pipe(unzipper.Extract({ path: dataDir }));
    }
}
