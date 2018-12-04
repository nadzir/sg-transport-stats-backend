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
import { BusStopService } from './BusStop';

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
                    passengerVol.yearMonth = data.YEAR_MONTH;
                    passengerVol.dayType = data.DAY_TYPE;
                    passengerVol.timePerHour = data.TIME_PER_HOUR;
                    passengerVol.ptType = data.PT_TYPE;
                    passengerVol.originPtCode = data.ORIGIN_PT_CODE;
                    passengerVol.destinationPtCode = data.DESTINATION_PT_CODE;
                    passengerVol.totalTrips = data.TOTAL_TRIPS;

                    const originBusStop = await this.busStopService.getBusStopDetail(passengerVol.originPtCode);
                    const destinationBusStop = await this.busStopService.getBusStopDetail(passengerVol.destinationPtCode);

                    if (originBusStop && destinationBusStop) {
                        // Getting from Google
                        // const originLatLng = [originBusStop.latitude, originBusStop.longitude];
                        // const destinationLatLng = [destinationBusStop.latitude, destinationBusStop.longitude];
                        // const polyline = await getDirections(originLatLng, destinationLatLng);
                        // passengerVol.polyline = polyline;

                        const oneMapKey = getOsEnv('ONE_MAP_TOKEN');
                        const response = await axios({
                            method: 'get',
                            /* tslint:disable-next-line */
                            url: `https://developers.onemap.sg/privateapi/routingsvc/route?start=${originBusStop.latitude},${originBusStop.longitude}&end=${destinationBusStop.latitude},${destinationBusStop.longitude}&routeType=pt&token=${oneMapKey}&date=2018-02-03&time=10:00:00&mode=BUS`
                        });
                        passengerVol.polyline = response.data.plan.itineraries[0].legs.reduce((polyline, leg) => {
                            return polyline = polyline + '[,]' + leg.legGeometry.points;
                        }, '');

                    }

                    stream.pause();

                    this.log.debug(`updating : ${ind}`);
                    ind = ind + 1;

                    try {
                        await this.passengerVolRepository.save(passengerVol);
                    } catch (error) {
                        console.error({ passengerVol });
                        this.log.error(error);
                    }

                    stream.resume();
                })
                .on('end', () => {
                    this.log.info(`Updated passenger volume from file ${fileName}`);
                    Promise.resolve();
                });
        });
    }
}
