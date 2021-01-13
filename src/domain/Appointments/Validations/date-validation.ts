import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { Double } from 'typeorm';
import { DaoAppointment } from '../port/Appointments/dao/dao-appointments';
import { ActionType } from '../Enums/ActionType';


@Injectable()
export class DateValidation {

    private readonly MS_HOUR = 3600000;

    constructor(private readonly daoAppointment: DaoAppointment) { }

    verifyAppointmentValidDate = (appointmentDate: string, type: ActionType) => {
        const appointmentDateConverted: Date = this.structureDate(appointmentDate);
        if ((new Date().getTime() > appointmentDateConverted.getTime()))
            throw new BussinessExcp({ code: `appointment_${type}_expired` });
    }

    verifyIfDoctorHaveAppointment = async (idDoctor: number, dateTime: Date) => {
        const appointment: {}[] = await this.daoAppointment.listAppointments(['appointmentdate'], [
            { idDoctor, appointmentStatus: 0 },
            { idDoctor, appointmentStatus: 1 }
        ]);
        if (appointment.length > 0) {
            this.verifyHourDiference(appointment, dateTime)
        }
    }
    verifyIfCustomerHaveAppointment = async (userId: number, dateTime: Date) => {
        const appointment: {}[] = await this.daoAppointment.listAppointments(['appointmentdate'], [
            { idUser: userId, appointmentStatus: 1 },
        ]);
        if (appointment.length > 0)
            this.verifyHourDiference(appointment, dateTime)
    }

    verifyHourDiference = (appointments: {}[], dateTime: Date) => {
        appointments.forEach((a: { appointmentdate: string }) => {
            const convertToDate: Date = this.structureDate(a.appointmentdate);
            const difference: Double = Math.abs(dateTime.getTime() - convertToDate.getTime()) / this.MS_HOUR;
            if (difference < 1) throw new BussinessExcp({ code: 'invalid_appointment_hour' });
        });
    }
    structureDate = (appointmentDate: string): Date => {
        const DateSplited: string[] = appointmentDate.split('/');
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
}