import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/domain/UserActions/Users/models/UserModel';
import { UserDTO } from 'src/domain/UserActions/Users/repositories/Users/DTO/UserDTO';
import { BalanceService } from 'src/domain/UserActions/Users/services/BalanceService';
import { UserService } from 'src/domain/UserActions/Users/services/UserService';


@Injectable()
export class UserRegisterManagment {
    constructor(private readonly userService : UserService,
        private readonly balanceService : BalanceService) {}

    public async executeCreate(user : UserDTO)
    {
        await this.userService.executeCreate(
            new UserModel(user)
        ); 
    }
    public async executeBalance(balance : number, userId : number)
    {
        await this.balanceService.executeBalance(balance, userId);
    }
}