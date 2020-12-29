import UserAuthModel from "src/domain/UserAuthentication/Model/UserAuthModel";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";
import UserAuthenticationService from "src/domain/UserAuthentication/Service/UserAuthenticationService";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - AuthUserService', () => {

    it("It should be fail if the user don't exists", async () => {
        const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(null, {
            UserAlreadyExists: jest.fn(async (email, dni) => false),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => null),
            VerifyBalancaCapacity: jest.fn((balance : number, userBalance : number) => 0)
        }, new UserException(), {
            validation: jest.fn((credentials: UserAuthModel, password: string) => false)
        });
        const user: LoginDTO = {
            email: '',
            password: ''
        }
        await expect(await _userAuthenticationService.ExecuteLogin(new UserAuthModel(user)))
            .rejects.toThrow('El usuario no existe');

    });

    it("It should be fail if the user exists but the password is incorrect", async () => {
        const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(null, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance : number, userBalance : number) => 0)
        }, new UserException(), {
            validation: jest.fn((credentials: UserAuthModel, password: string) => false)
        });
        const user: LoginDTO = {
            email: '',
            password: ''
        }
        await expect(_userAuthenticationService.ExecuteLogin(new UserAuthModel(user)))
            .rejects.toThrow('Contraseña Incorrecta');
    });
})