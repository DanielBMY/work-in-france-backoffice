import { config } from 'dotenv';

config();

const asString = (arg: any): string => {
    const res = process.env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return res;
}

const asNumber = (arg: any): number => {
    const res = process.env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return Number.parseInt(res, 10);
}

const asBoolean = (arg: any): boolean => {
    const res = process.env[arg]
    if (!res) {
        throw new Error(`env variable ${arg} is required`);
    }
    return 'true' === arg ? true : false;
}

export const configuration = {
    dsAPI: asString('DS_API'),
    dsApiLogin: asString('DS_API_LOGIN'),
    dsApiPasssword: asString('DS_API_PASSWORD'),

    kintoAPI: asString('KINTO_API'),
    kintoLogin: asString('KINTO_LOGIN'),
    kintoPassword: asString('KINTO_PASSWORD'),

    apiPrefix: asString('API_PREFIX'),
    // tslint:disable-next-line: object-literal-sort-keys
    apiPort: asNumber('API_PORT'),

    validityCheckEnable: asBoolean('VALIDITY_CHECK_ENABLE'),
    validityCheckCron: asString('VALIDITY_CHECK_CRON'),

    // tslint:disable-next-line: object-literal-sort-keys
    cronMontlyReport: asString('CRON_MONTHLY_REPORT'),

    direcctDomainName: asString('DIRECCT_DN'),

    alertMaxReceivedTimeInDays: asNumber(`ALERT_MAX_RECEIVED_TIME_IN_DAYS`),
    alertMaxInitiatedTimeInDays: asNumber(`ALERT_MAX_INITIATED_TIME_IN_DAYS`),
    alertDemarcheSimplifieeEmail: asString(`ALERT_DEMARCHE_SIMPLIFIEE_EMAIL`)
};

