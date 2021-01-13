import GlobalModelValidations from '../../Validations/GlobalModelValidations';

export class Appointment {

    private readonly idDoctor: number;
    private readonly doctorname: string;
    private readonly appointmentDate: string;
    private readonly StructuredDate: Date;
    private readonly cost: number;
    
    constructor(idDoctor: number, doctorname: string, appointmentDate: string, cost: number) {

        this.idDoctor = idDoctor;
        this.doctorname = doctorname;
        this.appointmentDate = appointmentDate;
        this.cost = cost;
        this.StructuredDate = this.structureDate();
        this.initializeValidations();
    }
    initializeValidations() {
        const MIN_COST : number = 0;
        const MAX_COST : number = 1000000;
        GlobalModelValidations.validDateFormat(this.appointmentDate);
        GlobalModelValidations.validDay(this.StructuredDate.getDay());
        GlobalModelValidations.validHours(this.appointmentDate, this.StructuredDate.getHours());
        GlobalModelValidations.isNumber('', this.idDoctor.toString());
        GlobalModelValidations.isNumber('cost', this.cost.toString());
        GlobalModelValidations.isHigherOrLower(this.cost, { min: MIN_COST, max: MAX_COST });
    }
    structureDate() {
        const TIME_INDEX : number = 3;
        const YEAR_INDEX : number = 2;
        const DateSplited: string[] = this.appointmentDate.split('/');
        const Time: string[] = DateSplited[TIME_INDEX].split(':');
        const YEAR: number = +DateSplited[YEAR_INDEX];
        const MONTH: number = +DateSplited[1];
        const DAY: number = +DateSplited[0];
        const HOUR: number = +Time[0];
        const MINUTES: number = +Time[1];
        return new Date(YEAR, MONTH, DAY, HOUR, MINUTES);
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
