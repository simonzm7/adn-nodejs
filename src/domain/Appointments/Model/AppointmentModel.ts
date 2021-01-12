import GlobalModelValidations from '../../Validations/GlobalModelValidations';import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
;
export class AppointmentModel {

    private readonly idDoctor : number;
    private readonly doctorname : string;
    private readonly appointmentDate : string;
    private readonly StructuredDate : Date;
    private readonly cost : number;
    constructor(idDoctor : number, doctorname : string, appointmentDate: string, cost: number) {

        this.idDoctor = idDoctor;
        this.doctorname = doctorname;
        this.appointmentDate = appointmentDate;
        this.cost = cost;
        this.StructuredDate = this.structureDate();
       this.initializeValidations();
    }
    initializeValidations(){
        GlobalModelValidations.validDateFormat(this.appointmentDate);
        GlobalModelValidations.validDay(this.StructuredDate.getDay());
        GlobalModelValidations.validHours(this.appointmentDate, this.StructuredDate.getHours());
        GlobalModelValidations.isNumber('', this.idDoctor.toString());
        GlobalModelValidations.isNumber('cost', this.cost.toString());
        GlobalModelValidations.isHigherOrLower(this.cost, { min: 0, max: 1000000 });
    }
    thereErrors(list: string[]) {
        return Promise.reject({ message: list, statusCode: 400 });
    }
    structureDate() {
        const splited: string[] = this.appointmentDate.split('/');
        const DateTime: string[] = splited[3].split(':');
        const date: Date = new Date(parseInt(splited[2]), parseInt(splited[1]), parseInt(splited[0])
            , parseInt(DateTime[0]), parseInt(DateTime[1]));
        return date;
    }
    ValidInputs(inputs: string[]) {
        inputs.forEach(e => { if (e) throw new BussinessExcp(e) })
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

    get getStructuredDate(): Date{
        return this.StructuredDate;
    }
}