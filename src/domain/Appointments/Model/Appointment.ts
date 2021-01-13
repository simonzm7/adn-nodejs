import GlobalModelValidations from '../../Validations/GlobalModelValidations';

export class Appointment {

    private readonly idDoctor: number;
    private readonly doctorname: string;
    private readonly appointmentDate: string;
    private readonly StructuredDate: Date;
    private readonly cost: number;
    // 
    private readonly TIME_INDEX : number = 3;
    private readonly YEAR_INDEX : number = 2;
    private readonly MONTH_AND_MINUTES_INDEX : number = 1;
    private readonly DAY_AND_HOUR_INDEX : number = 0;
    // 
    private readonly MIN_COST : number = 0;
    private readonly MAX_COST : number = 1000000;
    constructor(idDoctor: number, doctorname: string, appointmentDate: string, cost: number) {

        this.idDoctor = idDoctor;
        this.doctorname = doctorname;
        this.appointmentDate = appointmentDate;
        this.cost = cost;
        this.StructuredDate = this.structureDate();
        this.initializeValidations();
    }
    initializeValidations() {
        GlobalModelValidations.validDateFormat(this.appointmentDate);
        GlobalModelValidations.validDay(this.StructuredDate.getDay());
        GlobalModelValidations.validHours(this.appointmentDate, this.StructuredDate.getHours());
        GlobalModelValidations.isNumber('', this.idDoctor.toString());
        GlobalModelValidations.isNumber('cost', this.cost.toString());
        GlobalModelValidations.isHigherOrLower(this.cost, { min: this.MIN_COST, max: this.MAX_COST });
    }
    structureDate() {

        const DateSplited: string[] = this.appointmentDate.split('/');
        const Time: string[] = DateSplited[this.TIME_INDEX].split(':');
        const YEAR: number = +DateSplited[this.YEAR_INDEX];
        const MONTH: number = +DateSplited[this.MONTH_AND_MINUTES_INDEX];
        const DAY: number = +DateSplited[this.DAY_AND_HOUR_INDEX];
        const HOUR: number = +Time[this.DAY_AND_HOUR_INDEX];
        const MINUTES: number = +Time[this.MONTH_AND_MINUTES_INDEX];
        const date: Date = new Date(YEAR, MONTH, DAY, HOUR, MINUTES);
        return date;
    }
    get getDoctorId(): number {
        return this.idDoctor;
    }
    get getDoctorname(): string {
        return this.doctorname;
    }

    get getAppointmentDate(): string {
        return this.appointmentDate;
    }
    get getCost(): number {
        return this.cost;
    }

    get getStructuredDate(): Date {
        return this.StructuredDate;
    }
}