import { CommandCreateAppointment } from 'src/application/Appointments/command/command-create-appointment';
import { QueryAppointmentHandler } from 'src/application/Appointments/query/query-appointment-handler';
import { ActionType } from 'src/domain/Appointments/Enums/ActionType';
import { Appointment } from 'src/domain/Appointments/Model/Appointment';
import { AppointmentSelector } from 'src/domain/Appointments/Model/AppointmentSelector';
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentCommandService/AppointmentService'
import { BussinessExcp } from 'src/domain/Exceptions/BussinessExcp';
import { AppointmentEntity } from 'src/infraestructure/Appointments/Entity/appointment.entity';
import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';

describe('Domain - Appointment Service', () => {

    it('It should get the appointments list', async () => {
        const appoitmentsList: AppointmentEntity[] = [{ idAppointment: 1, idDoctor: 1, doctorname: 'DOCTOR NAME', appointmentdate: '2020-12-28 07:00:00.000', costappointment: 80500, appointmentStatus: 0, idUser: null, createdAt: new Date() }];
        const _appointmentService = new QueryAppointmentHandler(
            {
                listAppointments: jest.fn((async () => appoitmentsList)),
                findAppointmentByIdAndStatus: jest.fn((async () => new AppointmentEntity())),
                findAppointmentByIds: jest.fn(async () => new AppointmentEntity()),
                findAppointmentById: jest.fn(async () => new AppointmentEntity()),
            });
        expect(await _appointmentService.executeList()).toEqual(appoitmentsList);
    });

    it('It should get my appointments list', async () => {
        const appoitmentsList: {}[] = [{ idAppointment: 1, doctorname: 'DOCTOR NAME', appointmentdate: '2020-12-28 07:00:00.000', costappointment: 80500, appointmentStatus: 0 }];
        const _appointmentService = new QueryAppointmentHandler(
            {
                listAppointments: jest.fn((async () => appoitmentsList)),
                findAppointmentByIdAndStatus: jest.fn((async () => new AppointmentEntity())),
                findAppointmentByIds: jest.fn(async () => new AppointmentEntity()),
                findAppointmentById: jest.fn(async () => new AppointmentEntity()),
            });
        expect(await _appointmentService.executeMyList([])).toEqual(appoitmentsList);
    });

    it('It should get the doctor agenda list', async () => {
        const appoitmentsList: {}[] = [{ appointmentdate: '2020-12-28 07:00:00.000', appointmentStatus: 0 }];
        const _appointmentService = new QueryAppointmentHandler(
            {
                listAppointments: jest.fn((async () => appoitmentsList)),
                findAppointmentByIdAndStatus: jest.fn((async () => new AppointmentEntity())),
                findAppointmentByIds: jest.fn(async () => new AppointmentEntity()),
                findAppointmentById: jest.fn(async () => new AppointmentEntity()),
            });
        expect(await _appointmentService.executeAgendaList([])).toEqual(appoitmentsList);
    });



    const commandCreate: CommandCreateAppointment = {
        idDoctor: 1,
        doctorname: 'FIRSTNAME LASTNAME',
        appointmentDate: '25/11/2020/10:59',
        cost: 80500,
        idUser: null
    }
    const appointment: Appointment = new Appointment(
        commandCreate.idDoctor,
        commandCreate.doctorname,
        commandCreate.appointmentDate,
        commandCreate.cost,
    );

    const appointmentDto = {
        appointmentId: 1,
        week: '25/11/2020/10:59',
        userId: 1
    }

    it('It should fail if the Doctor want create an appointment on the past', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { throw new BussinessExcp({ code: 'appointment_create_expired' }) }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, null, null);
            await _appointmentService.executeCreate(appointment)
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_create_expired');
        }
    });
    // const _appointmentService: AppointmentService = new AppointmentService(
    //     null, null, null, {
    //         verifyAutoSelect: jest.fn(() => {}),
    //         verifyRole: jest.fn(() => {}),
    //         verifyDNI: jest.fn(() => {}),
    //         verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
    //         verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
    //         verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
    //     }, null);


    it('It should fail if the Doctor want create an appointment on the same hour', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_appointment_hour' }) }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, null, null);
            await _appointmentService.executeCreate(appointment)
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_appointment_hour');
        }
    });

    it('It should fail if the user not is a Doctor', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_permisons' }) }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, null);

            await _appointmentService.executeCreate(appointment);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_permisons');
        }
    });


    // // APPOINTMENT SELECTOR

    it('It should fail if the user want auto-select his appointment', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { throw new BussinessExcp({ code: 'auto_appointment' }) }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });

            const selectorModel: AppointmentSelector = new AppointmentSelector(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('auto_appointment');
        }
    });

    it('should fail if the user have an appointment', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_appointment_hour' }) }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });
            const selectorModel: AppointmentSelector = new AppointmentSelector(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_appointment_hour');
        }
    });


    it('It should fail if appointment not is available', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => { throw new BussinessExcp({ code: 'appointment_not_exists' }) }),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });
            const selectorModel: AppointmentSelector = new AppointmentSelector(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_not_exists');
        }
    });

    it('It should fail if appointment selection date is in the past', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { throw new BussinessExcp({ code: 'appointment_select_expired' }) }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });
            const selectorModel: AppointmentSelector = new AppointmentSelector(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_select_expired');
        }
    });



    it('It should fail if User do not have balance', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => { throw new BussinessExcp({ code: 'insuficient_balance' }) }),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });
            const selectorModel: AppointmentSelector = new AppointmentSelector(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('insuficient_balance');
        }
    });

    it('It should fail if User do not have dni day', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_dni_day' }) }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });
            const selectorModel: AppointmentSelector = new AppointmentSelector(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_dni_day');
        }
    });

    // // ExecuteCanceller

    it('It should fail if the appointment do not exists', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => { throw new BussinessExcp({ code: 'appointment_not_exists' }) }),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });
            await _appointmentService.executeCanceller(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_not_exists');
        }
    });

    it('It should fail if the user do not exists', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, {
                userAlreadyExists: jest.fn(async (email, dni) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => { throw new BussinessExcp({ code: 'email_not_found' }) }),
            }, {
                verifyAppointmentValidDate: jest.fn(() => { }),
                verifyHourDiference: jest.fn(() => { }),
                verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                verifyIfCustomerHaveAppointment: jest.fn(() => { }),
            }, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, {
                verifyAppointmentByIdsAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentByIdAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentStatusAndReturn: jest.fn(async () => new AppointmentEntity()),
                verifyAppointmentIsAvailable: jest.fn(() => { }),
            });

            await _appointmentService.executeCanceller(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('email_not_found');
        }
    });
    // ExecuteDeletor
    it('It should fail if the User do not is a Doctor', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(
                null, null, null, {
                verifyAutoSelect: jest.fn(() => { }),
                verifyRole: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_permisons' }) }),
                verifyDNI: jest.fn(() => { }),
                verifyIfCustomerHaveBalance: jest.fn(async () => new UserEntity()),
                verifyDoctorActionType: jest.fn(() => ActionType.Cancel),
                verifyCustomerActionType: jest.fn(() => ActionType.Cancel),
            }, null);
            await _appointmentService.executeDeletor(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_permisons');
        }
    });
})