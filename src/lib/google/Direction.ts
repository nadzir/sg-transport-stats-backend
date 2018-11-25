import { googleMapsClient } from '../google';

export const getDirections = (origin: any, destination: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        googleMapsClient.directions({
            origin,
            destination,
            mode: 'transit',
            transit_mode: ['bus']
        }, (err, response) => {
            // console.log(response)
            if (response.status === 200) {
                resolve(response.json.routes[0].legs[0].steps[0].polyline.points);
            }
            resolve(undefined);
        });
    })
};
