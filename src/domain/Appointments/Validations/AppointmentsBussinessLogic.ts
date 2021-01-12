import { Injectable } from "@nestjs/common";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import { WeekDays } from "src/domain/Appointments/Repository/Enums/WeekDays";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { UnauthorizedExcp } from "src/domain/Exceptions/UnauthorizedExcp";
import { DBRepository } from "src/domain/UserActions/Users/repositories/DB/DBRepository";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { Double } from "typeorm";
@Injectable()
export class AppointmentBussinessLogic {

    private readonly MS_HOUR = 3600000;
    private readonly DNI_START = 9;
    private readonly DNI_END = 10;

    constructor(
        private readonly dbRepository: DBRepository,
        private readonly appointmentDBRepository: AppointmentDBRepository) { }


    verifyAutoSelect = async (idUser: number, appointmentId: number) => {
        const appointment: Appointments = await this.appointmentDBRepository.findAppointmentById(appointmentId);

        if (Number(appointment.idDoctor) === Number(idUser))
            throw new BussinessExcp({ code: 'auto_appointment' });

    }

    verifyHourDiference = (appointments: Appointments[], dateTime: Date) => {
        appointments.forEach((a: Appointments) => {
            const convertToDate: Date = this.structureDate(a.appointmentdate);
            const difference: Double = Math.abs(dateTime.getTime() - convertToDate.getTime()) / this.MS_HOUR;
            if (difference < 1) throw new BussinessExcp({ code: 'invalid_appointment_hour' });
        });
    }
    verifyIfDoctorHaveAppointment = async (idDoctor: number, dateTime: Date) => {
        const appointment: Appointments[] = await this.appointmentDBRepository.listAppointments([
            { idDoctor, appointmentStatus: 0 }, 
            { idDoctor, appointmentStatus: 1 }
        ]);
        if (appointment.length > 0) {
            this.verifyHourDiference(appointment, dateTime)
        }
    }
    verifyIfCustomerHaveAppointment = async (userId: number, dateTime: Date) => {
        const appointment: Appointments[] = await this.appointmentDBRepository.listAppointments([
            { idUser: userId, appointmentStatus: 1 },
        ]);
        if (appointment.length > 0)
            this.verifyHourDiference(appointment, dateTime)
    }

    verifyRole = async (userId: number) => {
        const user: User = await this.dbRepository.findOneById(userId);
        if (!user)
            throw new BussinessExcp({ code: 'email_not_found' });

        if (!(user.role.toLocaleLowerCase() === 'doctor'))
            throw new UnauthorizedExcp({ code: 'invalid_permisons' });
    }

    verifyDNI = (dni: string, weekDay: number) => {
        if (parseInt(dni.substring(this.DNI_START, this.DNI_END)) % 2 === 0) {
            if (!(weekDay === WeekDays.Monday || weekDay === WeekDays.Wednesday || weekDay === WeekDays.Friday))
                throw new BussinessExcp({ code: 'invalid_dni_day' });

        }
        if (parseInt(dni.substring(this.DNI_START, this.DNI_END)) % 2 === 1) {
            if (!(weekDay === WeekDays.Tuesday || weekDay === WeekDays.Thursday || weekDay === WeekDays.Saturday))
                throw new BussinessExcp({ code: 'invalid_dni_day' });
        }
    }
    verifyAppointmentStatusAndReturn = async (idAppointment: number): Promise<Appointments> => {
        const Appointment: Appointments = await this.appointmentDBRepository.findAppointmentByIdAndStatus(idAppointment);

        if (!Appointment)
            throw new BussinessExcp({ code: 'appointment_not_exists' });
        return Promise.resolve(Appointment);
    }

    verifyAppointmentValidDate = (appointmentDate: string, type: ActionType) => {
        const appointmentDateConverted: Date = this.structureDate(appointmentDate);
        if ((new Date().getTime() > appointmentDateConverted.getTime()))
            throw new BussinessExcp({ code: `appointment_${type}_expired` });
    }
    verifyIfCustomerHaveBalance = async (userId: number, appointmentCost): Promise<User> => {
        const user: User = await this.dbRepository.findOneById(userId);
        if (!(user && user.balance >= appointmentCost)) throw new BussinessExcp({ code: 'insuficient_balance' });

        return Promise.resolve(user);
    }
    verifyAppointmentByIdsAndReturn = async (idAppointment: number, userId: number): Promise<Appointments> => {
        const Appointment: Appointments = await this.appointmentDBRepository.findAppointmentByIds(idAppointment, userId);
        if (!Appointment) throw new BussinessExcp({ code: 'appointment_not_exists' });

        return Promise.resolve(Appointment);
    }
    verifyAppointmentByIdAndReturn = async (idAppointment: number): Promise<Appointments> => {
        const Appointment: Appointments = await this.appointmentDBRepository.findAppointmentById(idAppointment);
        if (!Appointment) throw new BussinessExcp({ code: 'appointment_not_exists' });

        return Promise.resolve(Appointment);
    }

    structureDate = (appointmentDate: string): Date => {
        const splited: string[] = appointmentDate.split('/');
        const DateTime: string[] = splited[3].split(':');
        const date: Date = new Date(parseInt(splited[2]), parseInt(splited[1]), parseInt(splited[0])
            , parseInt(DateTime[0]), parseInt(DateTime[1]));
        return date;
    }
}