import { addMonths, getMonth, getYear, isBefore } from "date-fns";
import { Observable, Observer, Subject } from "rxjs";
import { concatMap, exhaustMap, filter, flatMap, map, mergeMap } from "rxjs/operators";
import { Alert } from "./model/alert.model";
import { MonthlyReport } from "./model/monthly-report.model";
import { alertService, dossierRecordService, monthlyreportService } from "./service";
import { logger } from "./util";
import { YearMonth } from "./util/interface/year-month";

class ExtractorService {

    private syncAllMonthlyReports$ = new Subject();
    private syncAllAlerts$ = new Subject();

    constructor() {
        this.initAllMonthlyReportSynchro();
        this.initAllAlertsSynchro();
    }

    public launchGlobalMonthlyReportSynchro() {
        this.syncAllMonthlyReports$.next();
    }

    public launchGlobalAlertSynchro() {
        this.syncAllAlerts$.next();
    }

    private allMonthlyReports(): Observable<MonthlyReport> {
        return allDates$.pipe(
            concatMap((res: YearMonth) => monthlyreportService.syncMonthlyReports(res.year, res.month))
        );
    }

    private allAlerts(): Observable<Alert> {
        return alertService.deleteAll().pipe(
            mergeMap(() => dossierRecordService.all()),
            flatMap(x => x),
            map(x => alertService.getAlert(x)),
            filter(x => x.messages.length > 0),
            mergeMap((alert: Alert) => alertService.saveOrUpdate(alert), undefined, 100),
        )
    }

    private initAllMonthlyReportSynchro() {
        this.syncAllMonthlyReports$.pipe(
            exhaustMap(_ => this.allMonthlyReports())
        ).subscribe({
            complete: () => logger.info(`[monthly reports synchro] completed`),
            error: (err) => logger.error(`[monthly reports synchro] error: `, err),
            next: (next: MonthlyReport) => logger.info(`[monthly reports synchro] report ${next.year}-${next.month} ${next.group.label} synchronised `)
        });
    }

    private initAllAlertsSynchro() {
        this.syncAllAlerts$.pipe(
            exhaustMap(_ => this.allAlerts())
        ).subscribe({
            complete: () => logger.info(`[alerts synchro] completed`),
            error: (err) => logger.error(`[alerts synchro] error: `, err),
            next: (next: Alert) => logger.info(`[alerts synchro] alert ${next.ds_key} created `)
        });
    }
}


const allDates$ = Observable.create((observer: Observer<YearMonth>) => {
    let start = new Date(2018, 1, 1);
    const onMonthBefore = addMonths(new Date(), -1);
    while (isBefore(start, onMonthBefore)) {
        observer.next({ year: getYear(start), month: getMonth(start) });
        start = addMonths(start, 1);
    }
    observer.complete();
});

export const extractorService = new ExtractorService();