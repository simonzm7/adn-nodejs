import { QueryAppointmentCase } from "src/application/Appointments/UseCases/query/QueryAppointmentCase";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentService } from "src/domain/Appointments/Services/AppointmentCommandService/AppointmentService"
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - Appointment Service', () => {

    it('It should get the appointments list', async () => {
        const appoitmentsList: Appointments[] = [{ idAppointment: 1, idDoctor: 1, doctorname: "DOCTOR NAME", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, idUser: null, createdAt: new Date() }];
        const _appointmentService = new QueryAppointmentCase(
            {
                createAppointment: jest.fn(() => { }),
                listAppointments: jest.fn((async () => appoitmentsList)),
                takeAppointment: jest.fn(() => { }),
                cancelAppointment: jest.fn(() => { }),
                deleteAppointment: jest.fn(() => { })
            }, null);
        expect(await _appointmentService.executeList()).toEqual(appoitmentsList);
    });

    it('It should get my appointments list', async () => {
        const appoitmentsList: Appointments[] = [{ idAppointment: 1, idDoctor: 1, doctorname: "DOCTOR NAME", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, idUser: 1, createdAt: new Date() }];
        const _appointmentService = new QueryAppointmentCase(
            {
                createAppointment: jest.fn(() => { }),
                listAppointments: jest.fn((async () => appoitmentsList)),
                takeAppointment: jest.fn(() => { }),
                cancelAppointment: jest.fn(() => { }),
                deleteAppointment: jest.fn(() => { })
            }, null);
        expect(await _appointmentService.executeMyList([{}])).toEqual(appoitmentsList);
    });

    it('It should get the doctor agenda list', async () => {
        const appoitmentsList: {}[] = [{ date: '', state: 1 }];
        const _appointmentService = new QueryAppointmentCase(
            null, {
            executeAgendaList: jest.fn(async () => appoitmentsList)
        });
        expect(await _appointmentService.executeAgendaList([{}])).toEqual(appoitmentsList);
    });







    it('It should fail if the Doctor want create an appointment on the past', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => false),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { throw new BussinessExcp({ code: 'appointment_create_expired' }) }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto: AppointmentDTO = {
                idDoctor: 1,
                doctorname: "Juan Zapata",
                appointmentDate: "25/11/2020/10:59",
                cost: 80500,
                idUser: null
            }
            const appointment: AppointmentModel = new AppointmentModel(
                appointmentDto.idDoctor,
                appointmentDto.doctorname,
                appointmentDto.appointmentDate,
                appointmentDto.cost,
            );
            await _appointmentService.executeCreate(appointment)
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_create_expired');
        }
    });


    it('It should fail if the Doctor want create an appointment on the same hour', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_appointment_hour' }) }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => false),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto: AppointmentDTO = {
                idDoctor: 1,
                doctorname: "Juan Zapata",
                appointmentDate: "25/11/2020/10:59",
                cost: 80500,
                idUser: null
            }
            const appointment: AppointmentModel = new AppointmentModel(
                appointmentDto.idDoctor,
                appointmentDto.doctorname,
                appointmentDto.appointmentDate,
                appointmentDto.cost,
            );
            await _appointmentService.executeCreate(appointment)
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_appointment_hour');
        }
    });

    it('It should fail if the user not is a Doctor', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_permisons' }) }),
                    verifyDNI: jest.fn(() => false),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto: AppointmentDTO = {
                idDoctor: 1,
                doctorname: "",
                appointmentDate: "25/11/2020/10:59",
                cost: 0,
                idUser: null
            }
            const appointment: AppointmentModel = new AppointmentModel(
                appointmentDto.idDoctor,
                appointmentDto.doctorname,
                appointmentDto.appointmentDate,
                appointmentDto.cost,
            );
            await _appointmentService.executeCreate(appointment);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_permisons');
        }
    });


    // APPOINTMENT SELECTOR

    it('It should fail if the user want auto-select his appointment', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { throw new BussinessExcp({ code: 'auto_appointment' }) }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto = {
                appointmentId: 1,
                week: '25/11/2020/10:59',
                userId: 1
            }
            const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('auto_appointment');
        }
    });

    it('should fail if the user have an appointment', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_appointment_hour' }) }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto = {
                appointmentId: 1,
                week: '25/11/2020/10:59',
                userId: 1
            }
            const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_appointment_hour');
        }
    });


    it('It should fail if appointment not is available', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => { throw new BussinessExcp({ code: 'appointment_not_exists' }) }),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto = {
                appointmentId: 1,
                week: '25/11/2020/10:59',
                userId: 1
            }
            const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_not_exists');
        }
    });

    it('It should fail if appointment selection date is in the past', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { throw new BussinessExcp({ code: 'appointment_select_expired' }) }),
                    verifyIfCustomerHaveBalance: jest.fn(() => Promise.reject(new User())),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto = {
                appointmentId: 1,
                week: '25/11/2020/10:59',
                userId: 1
            }
            const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_select_expired');
        }
    });



    it('It should fail if User do not have balance', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(() => { throw new BussinessExcp({ code: 'insuficient_balance' }) }),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto = {
                appointmentId: 1,
                week: '25/11/2020/10:59',
                userId: 1
            }
            const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
            const message = await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('insuficient_balance');
        }
    });

    it('It should fail if User do not have dni day', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_dni_day' }) }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(async () => new User()),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => Promise.reject(new Appointments())),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
            const appointmentDto = {
                appointmentId: 1,
                week: '25/11/2020/10:59',
                userId: 1
            }
            const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
            await _appointmentService.executeSelector(selectorModel);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_dni_day');
        }
    });

    // ExecuteCanceller

    it('It should fail if the appointment do not exists', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(async () => new User()),
                    verifyAppointmentByIdsAndReturn: jest.fn(() => { throw new BussinessExcp({ code: 'appointment_not_exists' }) }),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, {
                userAlreadyExists: jest.fn(() => { }),
                userAlreadyExistsAndReturn: jest.fn(async () => new User()),
                userHaveBalance: jest.fn(() => { }),
                validationPassword: jest.fn(() => { })

            });
            await _appointmentService.executeCanceller(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('appointment_not_exists');
        }
    });

    it('It should fail if the user do not exists', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(async () => new User()),
                    verifyAppointmentByIdsAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, {
                userAlreadyExists: jest.fn(() => { }),
                userAlreadyExistsAndReturn: jest.fn(async () => {throw new BussinessExcp({ code: 'email_not_found' })}),
                userHaveBalance: jest.fn(() => { }),
                validationPassword: jest.fn(() => { })

            });
            await _appointmentService.executeCanceller(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('email_not_found');
        }
    });
    // ExecuteDeletor
    it('It should fail if the User do not is a Doctor', async () => {
        try {
            const _appointmentService: AppointmentService = new AppointmentService(null,
                {
                    verifyAutoSelect: jest.fn(() => { }),
                    verifyHourDiference: jest.fn(() => { }),
                    verifyIfDoctorHaveAppointment: jest.fn(() => { }),
                    verifyIfCustomerHaveAppointment: jest.fn(() => { }),
                    verifyRole: jest.fn(() => { throw new BussinessExcp({ code: 'invalid_permisons' }) }),
                    verifyDNI: jest.fn(() => { }),
                    verifyAppointmentStatusAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentValidDate: jest.fn(() => { }),
                    verifyIfCustomerHaveBalance: jest.fn(async () => new User()),
                    verifyAppointmentByIdsAndReturn: jest.fn(async () => new Appointments()),
                    verifyAppointmentByIdAndReturn: jest.fn(() => Promise.reject(new Appointments()))
                }, null);
           await _appointmentService.executeDeletor(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_permisons');
        }
    });
})