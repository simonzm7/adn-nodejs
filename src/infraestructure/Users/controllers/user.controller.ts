import { Controller, Post, Body, Put, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UserCommand } from 'src/application/Users/Command/user-command';
import { UserHandler } from 'src/application/Users/Command/user-hander';
import { AuthGuard } from 'src/infraestructure/Appointments/adapters/Guard/AuthGuard';

@Controller('api/user')
export class UserController {

  constructor(private readonly userManagment: UserHandler) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() user: UserCommand) {
    await this.userManagment.executeCreate(user);
  }

  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  async updateBalance(@Body() newBalance: { balance : string }, @Req() req) {
    await this.userManagment.executeBalance(Number(newBalance.balance), req.headers.userid);
  }

}