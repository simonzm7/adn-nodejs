import { UserDto } from "src/application/UserAuthentication/Query/DTO/user.dto";
import { WeekDays } from "src/domain/Appointments/Enums/WeekDays";
import { UserAppointmentValidation } from "src/domain/Appointments/Validations/user-appointment-validation";
import { AppointmentEntity } from "src/infraestructure/Appointments/Entity/appointment.entity";
import { UserEntity } from "src/infraestructure/Users/Entity/user.entity";




describe('User Validations Test', () => {


    it('should be fail, if the doctor want to select his appointment', async () => {

        try {
            const appointmentEntity: AppointmentEntity = {
                idAppointment: 0,
                idDoctor: 1,
                doctorname: '',
                appointmentdate: '',
                costappointment: 10,
                appointmentStatus: 0,
                idUser: -1,
                createdAt: new Date()
            }

            const _userAppointmentValidation = new UserAppointmentValidation(null, {
                listAppointments: jest.fn(async () => [{}]),
                findAppointmentByParameters: jest.fn(async () => appointmentEntity)
            });

            await _userAppointmentValidation.verifyAutoSelect(1, 0);
        } catch (e) {
            expect(e.response.message.code).toBe('auto_appointment');
        }
    });



    it('should be fail, if the user not is a doctor', async () => {

        try {
            const user: UserEntity = {
                userId: 1,
                email: '',
                password: '',
                firstname: '',
                lastname: '',
                dni: '',
                balance: 0,
                role: 'Customer'
            }
            const _userAppointmentValidation = new UserAppointmentValidation({
                findOneByEmailAndDni: jest.fn(async () => new UserEntity()),
                findOneByEmail: jest.fn(async () => new UserEntity()),
                findOneByEmailOrId: jest.fn(async () => new UserEntity()),
                findOneById: jest.fn(() => user),
                findAndSelect: jest.fn(async () => new UserDto())
            }, null);

            await _userAppointmentValidation.verifyRole(1);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_permisons');
        }
    });


    it('should be fail, if the user not is on a dni day', async () => {

        try {

            const _userAppointmentValidation = new UserAppointmentValidation(null, null);

            await _userAppointmentValidation.verifyDNI('1234567890', WeekDays.Tuesday);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_dni_day');
        }
    });


    it('should be fail, if the user not have balance', async () => {

        try {
            const user: UserEntity = {
                userId: 1,
                email: '',
                password: '',
                firstname: '',
                lastname: '',
                dni: '',
                balance: 0,
                role: 'Customer'
            }
            const _userAppointmentValidation = new UserAppointmentValidation({
                findOneByEmailAndDni: jest.fn(async () => new UserEntity()),
                findOneByEmail: jest.fn(async () => new UserEntity()),
                findOneByEmailOrId: jest.fn(async () => new UserEntity()),
                findOneById: jest.fn(() => user),
                findAndSelect: jest.fn(async () => new UserDto())
            }, null);

            await _userAppointmentValidation.verifyIfCustomerHaveBalance(user.userId, 1000000);
        } catch (e) {
            expect(e.response.message.code).toBe('insuficient_balance');
        }
    });
})