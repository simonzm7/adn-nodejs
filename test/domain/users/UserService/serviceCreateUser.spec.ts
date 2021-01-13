import { UserService } from "src/domain/UserActions/Users/services/UserService";
import { BalanceService } from "src/domain/UserActions/Users/services/BalanceService";
import { BussinessExcp } from "src/domain/Exceptions/BussinessExcp";
import { User } from "src/domain/UserActions/Users/models/User";
import { UserCommand } from "src/application/Users/Command/user-command";
import { UserEntity } from "src/infraestructure/Users/Entity/user.entity";


describe('Domain - UserService', () => {
    it("It should be fail if when i'm creating user, the user already exists", async () => {
        try {
            const _userService = new UserService(null, {
                userAlreadyExists: jest.fn(async (email, dni) => { throw new BussinessExcp({ code: 'user_already_exists' }) }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => Promise.resolve(new UserEntity()))
            });
            const user: UserCommand = {
                email: "asd@asd.com",
                password: "12345",
                firstname: "FIRSTNAME",
                lastname: "LASTNAME",
                dni: "1234567890",
                role: "Customer"
            }

            await _userService.executeCreate(new User(user));
        } catch (e) {
            expect(e.response.message.code).toBe('user_already_exists');
        }

    });


    //ExecuteBalance

    it("It should be fail if the user in balance don't exists", async () => {
        try {
            const _userService = new BalanceService(null, {
                userAlreadyExists: jest.fn(async (email: string, dni: string) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => { throw new BussinessExcp({ code: 'email_not_found' }) }),
            }, null, null);
            await _userService.executeBalance(1, 1);
        } catch (e) {
            expect(e.response.message.code).toBe('email_not_found');
        }
    });

    // Put balance
    it('It should be fail if the user  balance exceds limit', async () => {
        try {
            const _userService = new BalanceService(null, {
                userAlreadyExists: jest.fn(async (email, dni) => { }),
                userAlreadyExistsAndReturn: jest.fn(async (email) => new UserEntity()),
            }, {
                userHaveBalance: jest.fn((balance: number, userBalance: number) => { throw new BussinessExcp({ code: 'invalid_balance' }) }),
                addBalance: jest.fn(() => 0)
            }, null);
            await _userService.executeBalance(1, 1)
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_balance');
        }
    });
});