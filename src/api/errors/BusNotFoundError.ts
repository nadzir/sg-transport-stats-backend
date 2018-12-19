import { HttpError } from 'routing-controllers';

export class BusNotFoundError extends HttpError {
    constructor() {
        super(404, 'Bus not found!');
    }
}
