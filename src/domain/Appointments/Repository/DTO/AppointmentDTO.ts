import { IsString, IsNumber, IsBoolean } from 'class-validator';
export class AppointmentDTO {

    
    idDoctor: number;

    @IsString()
    doctorname: string;

    @IsString()
    appointmentDate: string;

    @IsNumber()
    cost: number;

    idUser: number;
}