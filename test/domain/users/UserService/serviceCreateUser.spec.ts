import { HttpStatus } from "@nestjs/common";
import { response } from "express";
import { UserModel } from "src/domain/Users/models/UserModel";
import { UserDTO } from "src/domain/Users/repositories/Users/DTO/UserDTO";
import { UserService } from "src/domain/Users/services/UserService";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - UserService', () => {
    it("It should be fail if when i'm creating user, the user already exists", async () => {
        const _userService = new UserService(null, {
            UserAlreadyExists: jest.fn(async (email, dni) => true),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance: number, userBalance: number) => 0)
        });
        const user: UserDTO = {
            email: "asd@asd.com",
            password: "12345",
            firstname: "juan",
            lastname: "zapata",
            dni: "1234567890",
            role: "Customer"
        }

        const result = _userService.Execute(new UserModel(user)).catch((err) => err.message);

        await expect(await result).toEqual('User Already Exists');
    });


    //ExecuteBalance

    it("It should be fail if the user in balance don't exists", async () => {
        const _userService = new UserService({
            createUser: jest.fn(async (user: UserModel) => Promise.resolve({})),
            updateBalance: jest.fn(async (balance: number, user: User) => Promise.resolve({})),
            findUserByIdAndReturn: jest.fn(async (userId: number) => null)
        }, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance: number, userBalance: number) => 0)
        });

        const message = _userService.ExecuteBalance(1, 1).catch((err) => err.message)
        expect(await message)
            .toEqual("El usuario no existe");
    });


    it('It should be fail if the user  balance exceds limit', async () => {
        const _userService = new UserService({
            createUser: jest.fn(async (user: UserModel) => Promise.resolve({})),
            updateBalance: jest.fn(async (balance: number, user: User) => Promise.resolve({})),
            findUserByIdAndReturn: jest.fn(async (userId: number) => new User())
        }, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance: number, userBalance: number) => 0)
        });
        const response = _userService.ExecuteBalance(1, 1).catch((err) => err.message);

         expect(await response).toEqual('Solo puede ingresar el balance de : 0');
    });
});