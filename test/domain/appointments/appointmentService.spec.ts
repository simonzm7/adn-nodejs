import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { AppointmentService } from "src/domain/Appointments/Services/AppointmentService"
import { UserModel } from "src/domain/Users/models/UserModel";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - Appointment Service', () => {

    it('It should fail if the Doctor want create an appointment on the same hour', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => true),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, null);
        const appointmentDto: AppointmentDTO = {
            idDoctor: 1,
            doctorname: "Juan Zapata",
            appointmentDate: "25/11/2020/10:59:59",
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const appointment: AppointmentModel = new AppointmentModel(appointmentDto);
        const message = _appointmentService.ExecuteCreate(appointment).catch(err => err.message);
        expect(await message).toEqual('Solo puedes crear una cita cada hora');
    });

    it('It should fail if the user not is a Doctor', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, null);
        const appointmentDto: AppointmentDTO = {
            idDoctor: 1,
            doctorname: "",
            appointmentDate: "25/11/2020/10:59:59",
            cost: 0,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const appointment: AppointmentModel = new AppointmentModel(appointmentDto);
        const message = _appointmentService.ExecuteCreate(appointment).catch(err => err.message);
        expect(await message).toEqual('No puedes crear una cita');
    });

    it('It should get the appointments list', async () => {
        const appoitmentsList: Appointments[] = [{ idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }];
        const _appointmentService = new AppointmentService(
            {
                createAppointment: jest.fn(async (appointment: AppointmentModel) => Promise.resolve({})),
                listAppointments: jest.fn((async (parameters: {}) => appoitmentsList)),
                takeAppointment: jest.fn(async (appointment: Appointments, user: User) => Promise.resolve({})),
                cancelAppointment: jest.fn(async (appointment: Appointments, user: User) => Promise.resolve({})),
                cancelAppointmentWithoutUser: jest.fn(async (appointment: Appointments) => Promise.resolve({})),
                deleteAppointment: jest.fn(async (appointmentId: number) => Promise.resolve({}))
            }, null, null);
        expect(await _appointmentService.ExecuteList()).toEqual(appoitmentsList);
    });


    it('It should fail if appointment not is available', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => false),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, null);
        const appointmentDto: AppointmentSelectorDTo = {
            AppointmentId: 1,
            week: '25/11/2020/10:59:59',
            userId: 1
        }
        const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
        const message = _appointmentService.ExecuteSelector(selectorModel)
            .catch(err => err.message);
        expect(await message).toBe('La cita no se encuentra disponible');
    });

    it('It should fail if User do not have balance', async () => {
        const appointment: Appointments = { idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => appointment),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => null),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, null);
        const appointmentDto: AppointmentSelectorDTo = {
            AppointmentId: 1,
            week: '25/11/2020/10:59:59',
            userId: 1
        }
        const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
        const message = _appointmentService.ExecuteSelector(selectorModel).catch(err => err.message);
        expect(await message).toEqual('No tienes saldo disponible');
    });

    it('It should fail if User do not have pico and cedula', async () => {
        const appointment: Appointments = { idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }
        const user: any = {
            userId: 1,
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            dni: "",
            balance: 5000000,
        }
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => appointment),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => user),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, null);
        const appointmentDto: AppointmentSelectorDTo = {
            AppointmentId: 1,
            week: '25/11/2020/10:59:59',
            userId: 1
        }
        const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
        const message = _appointmentService.ExecuteSelector(selectorModel).catch(err => err.message);
        expect(await message).toEqual('No te encuentras en día pico y cédula');
    });

    //     // ExecuteCanceller

    it('It should fail if the appointment do not exists', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => true),
            }, {
            findOneByEmailAndDni: jest.fn(async (email: string, dni: string) => new User()),
            findOneByEmail: jest.fn(async (email: string) => new User()),
            findOneById: jest.fn(async (id: number) => null),
            CreateOne: jest.fn(async (user: UserModel) => Promise.resolve({})),
            UpdateBalance: jest.fn(async (user: User) => Promise.resolve({})),
        });
        const message = _appointmentService.ExecuteCanceller(1, 1).catch(err => err.message);
        expect(await message).toEqual('El usuario no existe');
    });
    // ExecuteDeletor
    it('It should fail if the User do not is a Doctor', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => true),
            }, null);
        const message = _appointmentService.ExecuteDeletor(1, 1).catch(err => err.message);
        expect(await message).toEqual('No puedes cancelar una cita');
    });

})