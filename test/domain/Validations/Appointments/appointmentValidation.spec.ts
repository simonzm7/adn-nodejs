import { AppointmentValidation } from "src/domain/Appointments/Validations/appointment-validation"
import { AppointmentEntity } from "src/infraestructure/Appointments/Entity/appointment.entity";




describe('Appointment Validation test', () => {


    it('should fail if the find of appointment by id not exists', async () => {
        try{
            const _appointmentValidation = new AppointmentValidation({
                listAppointments: jest.fn(async () => [{}]),
                findAppointmentByParameters: jest.fn(async () => null),
            });
    
            await _appointmentValidation.verifyAppointmentByParameters([{}]);
        }catch(e) {
            expect(e.response.message.code).toBe('appointment_not_exists')
        }
    });
})