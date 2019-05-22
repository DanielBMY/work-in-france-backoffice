import { addMonths } from 'date-fns';
import { Observable } from "rxjs";
import { DossierRecord } from "../model";
import { dossierRecordRepository } from "../repository";

class DossierRecordService {

    public all(): Observable<DossierRecord[]> {
        return dossierRecordRepository.all();
    }

    public allByMonth(year: number, month: number) {
        const start = new Date(year, month, 1).getTime();
        const end = addMonths(start, 1).getTime();
        return dossierRecordRepository.allByProcessedAtBetween(start, end);
    }

    public allByStateAndProcessedAtBetween(state: string, start: number, end: number) {
        return dossierRecordRepository.allByStateAndProcessedAtBetween(state, start, end);
    }

    public allByUpdatedAtBetween(start: number, end: number) {
        return dossierRecordRepository.allByUpdatedAtBetween(start, end);
    }

}

export const dossierRecordService = new DossierRecordService();