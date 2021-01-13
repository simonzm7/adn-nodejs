

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
        const DateSplited: string[] = this.week.split('/');
        const Time: string[] = DateSplited[3].split(':');
        // 
        const YEAR: number = +DateSplited[2];
        const MONTH: number = +DateSplited[1];
        const DAY: number = +DateSplited[0];
        const HOUR: number = +Time[0];
        const MINUTES: number = +Time[1];
        const date: Date = new Date(YEAR, MONTH, DAY, HOUR, MINUTES)
        return date;
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