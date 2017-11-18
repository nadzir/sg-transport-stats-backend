/**
 * Environment variables
 */
export const env = {
    app: {
        name: getOsEnv('APP_NAME'),
        host: getOsEnv('APP_HOST'),
        port: toNumber(getOsEnv('APP_PORT')),
        urlPrefix: getOsEnv('APP_URL_PREFIX')
    },
    log: {
        level: getOsEnv('LOG_LEVEL')
    },
    db: {
        type: getOsEnv('DB_TYPE'),
        host: getOsEnv('DB_HOST'),
        port: toNumber(getOsEnv('DB_PORT')),
        username: getOsEnv('DB_USERNAME'),
        password: getOsEnv('DB_PASSWORD'),
        database: getOsEnv('DB_DATABASE'),
        synchronize: toBool(getOsEnv('DB_SYNCHRONIZE')),
        logging: toBool(getOsEnv('DB_LOGGING'))
    }
};

function getOsEnv(key: string): string {
    return `${process.env[key]}`;
}

function toNumber(value: string): number {
    return parseInt(value, 10);
}

function toBool(value: string): boolean {
    return value === 'true';
}
