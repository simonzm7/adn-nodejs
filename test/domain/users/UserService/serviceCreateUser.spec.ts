import UserAuthModel from "src/domain/UserActions/UserAuthentication/Model/UserAuthModel";
import { UserModel } from "src/domain/UserActions/Users/models/UserModel";
import { UserDTO } from "src/domain/UserActions/Users/repositories/Users/DTO/UserDTO";
import { UserService } from "src/domain/UserActions/Users/services/UserService";
import { BalanceService } from "src/domain/UserActions/Users/services/BalanceService";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";


describe('Domain - UserService', () => {
    it("It should be fail if when i'm creating user, the user already exists", async () => {
        try {
            const _userService = new UserService(null, {
                userAlreadyExists: jest.fn(async (email, dni) => { throw new BussinessExcp({ code: 'user_already_exists' }) }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => Promise.resolve(new User())),
                userHaveBalance: jest.fn(async (balance: number, userBalance: number) => { }),
                validationPassword: jest.fn((credentials: UserAuthModel, password: string) => { })
            });
            const user: UserDTO = {
                email: "asd@asd.com",
                password: "12345",
                firstname: "juan",
                lastname: "zapata",
                dni: "1234567890",
                role: "Customer"
            }

            await _userService.executeCreate(new UserModel(user));
        } catch (e) {
            expect(e.response.message.code).toBe('user_already_exists');
        }

    });


    //ExecuteBalance

    it("It should be fail if the user in balance don't exists", async () => {
        try {
            const _userService = new BalanceService({
                createUser: jest.fn(async (user: UserModel) => Promise.resolve({})),
                updateBalance: jest.fn(async (balance: number, user: User) => Promise.resolve({}))
            }, {
                userAlreadyExists: jest.fn(async (email: string, dni: string) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => { throw new BussinessExcp({ code: 'email_not_found' })  }),
                userHaveBalance: jest.fn(async (balance: number, userBalance: number) => {}),
                validationPassword: jest.fn((credentials: UserAuthModel, password: string) => { }),
            });
            await _userService.executeBalance(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('email_not_found');
        }
    });

    // Put balance
    it('It should be fail if the user  balance exceds limit', async () => {
        try {
            const _userService = new BalanceService({
                createUser: jest.fn(async (user: UserModel) => Promise.resolve({})),
                updateBalance: jest.fn(async (balance: number, user: User) => Promise.resolve({}))
            }, {
                userAlreadyExists: jest.fn(async (email, dni) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
                userHaveBalance: jest.fn((balance: number, userBalance: number) => { throw new BussinessExcp({code: 'invalid_balance'}) }),
                validationPassword: jest.fn((credentials: UserAuthModel, password: string) => { })
            });
            await _userService.executeBalance(1, 1)
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_balance');
        }
    });
});