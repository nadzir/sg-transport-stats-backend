import google from '@google/maps';
import {getOsEnv} from '../env/utils';

export const googleMapsClient = google.createClient({
    key: getOsEnv('GOOGLE_MAP_API_KEY'),
});
