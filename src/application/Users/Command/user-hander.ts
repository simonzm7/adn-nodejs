import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/UserActions/Users/models/User';
import { BalanceService } from 'src/domain/UserActions/Users/services/BalanceService';
import { UserService } from 'src/domain/UserActions/Users/services/UserService';
import { UserCommand } from './user-command';

@Injectable()
export class UserHandler {
    constructor(private readonly userService : UserService,
        private readonly balanceService : BalanceService) {}

    public async executeCreate(user : UserCommand)
    {
        await this.userService.executeCreate(
            new User(user)
        ); 
    }
    public async executeBalance(balance : number, userId : number)
    {
        await this.balanceService.executeBalance(balance, userId);
    }
}
