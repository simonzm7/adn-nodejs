import { IsString, IsNumber } from 'class-validator';
export class CommandCreateAppointment {

    
    idDoctor: number;

    @IsString()
    doctorname: string;

    @IsString()
    appointmentDate: string;

    @IsNumber()
    cost: number;

    idUser: number;
}
