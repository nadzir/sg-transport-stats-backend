import { Service } from 'typedi';
import https from 'https';
import axios from 'axios';
import fs from 'fs';
import unzipper from 'unzipper';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { getOsEnv } from '../../lib/env/utils';
import { PassengerVolRepository } from '../repositories/PassengerVolRepository';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { PassengerVol } from '../models/PassengerVol';
import { BusStopService } from './BusStop';
import { get, omit } from 'lodash';
import LineByLineReader from 'line-by-line';
import csv from 'csvtojson';

@Service()
export class PassengerVolService {

    constructor(
        @OrmRepository() private passengerVolRepository: PassengerVolRepository,
        @Logger(__filename) private log: LoggerInterface,
        private busStopService: BusStopService
    ) { }

    public find(): Promise<PassengerVol[]> {
        this.log.info('Find all passenger volume');
        return this.passengerVolRepository.findWithLocation();
    }

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
                resp.pipe(file)
                    .on('finish', () => Promise.resolve(true));
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

            const lr = new LineByLineReader(`${dataDir}/${fileName}`, {
                encoding: 'utf8',
                skipEmptyLines: true,
            });

            lr.on('error', err => {
                this.log.error(`Error reading file : ${err}`);
            });

            lr.on('line', async (line) => {
                lr.pause();

                csv({
                    noheader: true,
                    output: 'csv',
                }).fromString(line)
                    .then(async (csvRow) => {
                        // Get the data
                        const passengerVol = new PassengerVol();
                        passengerVol.yearMonth = csvRow[0][0];
                        passengerVol.dayType = csvRow[0][1];
                        passengerVol.timePerHour = csvRow[0][2];
                        passengerVol.ptType = csvRow[0][3];
                        passengerVol.originPtCode = csvRow[0][4];
                        passengerVol.destinationPtCode = csvRow[0][5];
                        passengerVol.totalTrips = csvRow[0][6];

                        // Return if header
                        if (passengerVol.yearMonth === 'YEAR_MONTH') {
                            lr.resume();
                            return;
                        }

                        // Check if data exists
                        const foundPassengerVols = await this.passengerVolRepository.find({
                            where: {
                                yearMonth: passengerVol.yearMonth,
                                dayType: passengerVol.dayType,
                                timePerHour: passengerVol.timePerHour,
                                ptType: passengerVol.ptType,
                                originPtCode: passengerVol.originPtCode,
                                destinationPtCode: passengerVol.destinationPtCode,
                            },
                        });
                        const foundPassengerVol = foundPassengerVols.length === 0 ? undefined : foundPassengerVols[0];

                        // If new data or polyline is null
                        if (foundPassengerVol === undefined || get(foundPassengerVol, 'polyline') === null) {
                            setTimeout(async () => {
                                await getPolyline(passengerVol);
                                lr.resume();
                            }, ind * 1000);
                            ind = ind + 1;
                        } else {
                            lr.resume();
                        }
                    });
            });

            lr.on('end', () => {
                this.log.info(`Updated passenger volume from file ${fileName}`);
                Promise.resolve();
            });

            const getPolyline = async (passengerVol) => {

                this.log.debug(`Updating polyline`);

                const originBusStop = await this.busStopService.getBusStopDetail(passengerVol.originPtCode);
                const destinationBusStop = await this.busStopService.getBusStopDetail(passengerVol.destinationPtCode);

                if (originBusStop && destinationBusStop) {
                    // Getting from one map
                    try {
                        this.log.debug(`Calling one map api`);
                        const oneMapKey = getOsEnv('ONE_MAP_TOKEN');
                        const response = await axios({
                            method: 'get',
                            /* tslint:disable-next-line */
                            url: `https://developers.onemap.sg/privateapi/routingsvc/route?start=${originBusStop.latitude},${originBusStop.longitude}&end=${destinationBusStop.latitude},${destinationBusStop.longitude}&routeType=pt&token=${oneMapKey}&date=2018-02-03&time=10:00:00&mode=BUS`
                        });
                        passengerVol.polyline = response.data.plan.itineraries[0].legs.reduce((polyline, leg) => {
                            return polyline = polyline + '[,]' + leg.legGeometry.points;
                        }, '');
                    } catch (error) {
                        this.log.error(error);
                    }
                }

                try {
                    // Delete previous polyline
                    await this.passengerVolRepository.delete(omit(passengerVol, ['polyline']));
                    // Save
                    await this.passengerVolRepository.save(passengerVol);
                } catch (error) {
                    console.error({ passengerVol });
                    this.log.error(error);
                }
            };
        });
    }
}
