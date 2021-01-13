

export class AppointmentSelector {

    private readonly appointmentId: number;
    private readonly week: string;
    private readonly userId: number;
    private appointmentDate: Date;
    constructor({ appointmentId, week, userId }) {
        this.appointmentId = appointmentId;
        this.week = week;
        this.userId = userId;
        this.appointmentDate = this.structureDate();
    }
    structureDate() {
        const TIME_INDEX  = 3;
        const YEAR_INDEX  = 2;
        const MONTH_AND_MINUTES = 1;
        const DAY_AND_HOUR = 0;
        const DateSplited: string[] = this.week.split('/');
        const Time: string[] = DateSplited[TIME_INDEX].split(':');
        const YEAR: number = +DateSplited[YEAR_INDEX];
        const MONTH: number = +DateSplited[MONTH_AND_MINUTES];
        const DAY: number = +DateSplited[DAY_AND_HOUR];
        const HOUR: number = +Time[DAY_AND_HOUR];
        const MINUTES: number = +Time[MONTH_AND_MINUTES];
        return new Date(YEAR, MONTH, DAY, HOUR, MINUTES)
    }
    get getAppointmentDate(): Date {
        return this.appointmentDate;
    }
    get getWeekDay(): number {
        const week: number = this.appointmentDate.getDay();
        return week;
    }

    get getAppointmentId(): number {
        return this.appointmentId;
    }
    get getUserId(): number {
        return this.userId;
    }
}
