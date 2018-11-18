import { Service } from 'typedi';
import https from 'https';
import axios from 'axios';
import fs from 'fs';
import unzipper from 'unzipper';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { getOsEnv } from '../../lib/env/utils';
import { PassengerVolRepository } from '../repositories/PassengerVolRepository';
import { OrmRepository } from 'typeorm-typedi-extensions';
import csv from 'csv-parser';
import { PassengerVol } from '../models/PassengerVol';
import uuid = require('uuid');

@Service()
export class PassengerVolService {

    constructor(
        @OrmRepository() private passengerVolRepository: PassengerVolRepository,
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

    public async update(dataDir: string): Promise<void> {
        this.log.info(`Reading data passenger volume from path ${dataDir}`);
        const files = fs.readdirSync(dataDir);
        files.forEach((fileName) => {
            this.log.info(`Reading data passenger volume from file ${fileName}`);
            let ind = 0;
            const stream = fs.createReadStream(`${dataDir}/${fileName}`, { highWaterMark: 1 });
            stream
                .pipe(csv())
                .on('data', async (data) => {
                    const passengerVol = new PassengerVol();
                    passengerVol.id = uuid.v1();
                    passengerVol.yearMonth = data.YEAR_MONTH;
                    passengerVol.dayType = data.DAY_TYPE;
                    passengerVol.timePerHour = data.TIME_PER_HOUR;
                    passengerVol.ptType = data.PT_TYPE;
                    passengerVol.originPtCode = data.ORIGIN_PT_CODE;
                    passengerVol.destinationPtCode = data.DESTINATION_PT_CODE;
                    passengerVol.totalTrips = data.TOTAL_TRIPS;
                    stream.pause();
                    this.log.debug(`updating : ${ind}`);
                    ind = ind + 1;
                    await this.passengerVolRepository.save(passengerVol);
                    stream.resume();
                })
                .on('end', () => {
                    this.log.info(`Updated passenger volume from file ${fileName}`);
                    Promise.resolve();
                });
        });
    }
}
