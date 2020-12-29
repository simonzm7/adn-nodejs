import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/domain/Users/models/UserModel';
import { UserDTO } from 'src/domain/Users/repositories/Users/DTO/UserDTO';
import { UserService } from 'src/domain/Users/services/UserService';
import { UserException } from 'src/infraestructure/Exceptions/Adapters/UserException';


@Injectable()
export class UserRegisterManagment {
    constructor(private readonly userService : UserService) {}

    public async Execute(user : UserDTO) : Promise<{}>
    {
        return await this.userService.Execute(
            new UserModel(user)
        ); 
    }
    public async ExecuteBalance(balance : number, userId : number) : Promise<{}>
    {
        return await this.userService.ExecuteBalance(balance, userId);
    }
}