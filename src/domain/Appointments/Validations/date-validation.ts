import { Injectable } from '@nestjs/common';
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { Double } from 'typeorm';
import { DaoAppointment } from '../port/Appointments/dao/dao-appointments';
import { ActionType } from '../Enums/ActionType';
import { DateValidationRepository } from '../port/Validations/date-validation-repository';


@Injectable()
export class DateValidation implements DateValidationRepository{

    constructor(private readonly daoAppointment: DaoAppointment) { }

    public verifyAppointmentValidDate = (appointmentDate: string, type: ActionType) => {
        const appointmentDateConverted: Date = this.structureDate(appointmentDate);
        if ((new Date().getTime() > appointmentDateConverted.getTime())) {
            throw new BussinessExcp({ code: `appointment_${type}_expired` });
        }
    };

    public verifyIfDoctorHaveAppointment = async (idDoctor: number, dateTime: Date) => {
        const appointment: {}[] = await this.daoAppointment.listAppointments(['appointmentdate'], [
            { idDoctor, appointmentStatus: 0 },
            { idDoctor, appointmentStatus: 1 }
        ]);
        if (appointment.length > 0) {
            this.verifyHourDiference(appointment, dateTime);
        }
    };
    public verifyIfCustomerHaveAppointment = async (userId: number, dateTime: Date) => {
        const appointment: {}[] = await this.daoAppointment.listAppointments(['appointmentdate'], [
            { idUser: userId, appointmentStatus: 1 },
        ]);
        if (appointment.length > 0) {
            this.verifyHourDiference(appointment, dateTime);
        }
    };

    public verifyHourDiference = (appointments: {}[], dateTime: Date) => {
        appointments.forEach((a: { appointmentdate: string }) => {
            const MS_HOUR = 3600000;
            const convertToDate: Date = this.structureDate(a.appointmentdate);
            const difference: Double = Math.abs(dateTime.getTime() - convertToDate.getTime()) / MS_HOUR;
            if (difference < 1) {
                throw new BussinessExcp({ code: 'invalid_appointment_hour' });
            }
        });
    };
    private structureDate = (appointmentDate: string): Date => {
        const YEAR_SPLITED_INDEX = 2;
        const MONTH_SPLITED_INDEX = 1;
        const TIME_SPLITED_INDEX = 3;
        const DAY_AND_HOUR_SPLITED_INDEX = 0;
        const DateSplited: string[] = appointmentDate.split('/');
        const Time: string[] = DateSplited[TIME_SPLITED_INDEX].split(':');
        const YEAR: number = +DateSplited[YEAR_SPLITED_INDEX];
        const MONTH: number = +DateSplited[MONTH_SPLITED_INDEX];
        const DAY: number = +DateSplited[DAY_AND_HOUR_SPLITED_INDEX];
        const HOUR: number = +Time[DAY_AND_HOUR_SPLITED_INDEX];
        const MINUTES: number = +Time[MONTH_SPLITED_INDEX];
        return new Date(YEAR, MONTH, DAY, HOUR, MINUTES);
    };
}
