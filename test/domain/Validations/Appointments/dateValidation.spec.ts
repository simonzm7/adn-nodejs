import { ActionType } from "src/domain/Appointments/Enums/ActionType";
import { DateValidation } from "src/domain/Appointments/Validations/date-validation";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { AppointmentEntity } from "src/infraestructure/Appointments/Entity/appointment.entity";





describe('Date Appointment Validation Tests', () => {


    it('it should fail if doctor want to create appointment in the past', () => {
        try {
            const _dateValidation = new DateValidation({
                listAppointments: jest.fn(async () => [{}]),
                findAppointmentByParameters: jest.fn(async () => new AppointmentEntity())
            });

            _dateValidation.verifyAppointmentValidDate('13/00/2020/13:00', ActionType.Create);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_create_expired');
        }
    });



    it('it should fail if doctor have an appointment', async () => {
        try {
            const _dateValidation = new DateValidation({
                listAppointments: jest.fn(async () => [{}, {}, {}]),
                findAppointmentByParameters: jest.fn(async () => new AppointmentEntity()),
            });
            jest.spyOn(_dateValidation, 'verifyHourDiference').mockImplementation(() => { throw new BussinessExcp({ code: 'invalid_appointment_hour' }) })
            await _dateValidation.verifyIfDoctorHaveAppointment(null, null);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_appointment_hour');
        }   
    });

    it('it should fail if Customer have an appointment', async () => {
        try {
            const _dateValidation = new DateValidation({
                listAppointments: jest.fn(async () => [{}, {}, {}]),
                findAppointmentByParameters: jest.fn(async () => new AppointmentEntity()),
            });
            jest.spyOn(_dateValidation, 'verifyHourDiference').mockImplementation(() => { throw new BussinessExcp({ code: 'invalid_appointment_hour' }) })
            await _dateValidation.verifyIfCustomerHaveAppointment(null, null);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_appointment_hour');
        }   
    });
})