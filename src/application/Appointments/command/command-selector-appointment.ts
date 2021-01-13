import { IsString, IsNumber } from 'class-validator';
export class CommandSelectorAppointment {

    @IsNumber()
    AppointmentId: number;
    
    @IsString()
    week: string;

    userId: number;
}