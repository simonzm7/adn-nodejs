

interface ISelectorModel  {
    appointmentId: number;
    week: string;
    userId: number;
}
export class AppointmentSelectorModel {

    private readonly appointmentId: number;
    private readonly week: string;
    private readonly userId: number;
    private appointmentDate: Date;
    constructor({appointmentId, week, userId} : ISelectorModel) {
        this.appointmentId = appointmentId;
        this.week = week;
        this.userId = userId;
        this.appointmentDate = this.structureDate();
    }
    structureDate() {
        const splited: string[] = this.week.split('/');
        const DateTime: string[] = splited[3].split(':');
        const date: Date = new Date(parseInt(splited[2]), parseInt(splited[1]), parseInt(splited[0])
            , parseInt(DateTime[0]), parseInt(DateTime[1]));
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