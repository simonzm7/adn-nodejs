import { Controller, Post, Body, Res, Put, UsePipes, ValidationPipe, UseGuards, Req, Get, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import { UserDTO } from 'src/domain/UserActions/Users/repositories/Users/DTO/UserDTO';
import { AuthGuard } from 'src/infraestructure/Appointments/adapters/Guard/AuthGuard';

@Controller('api/user')
export class UserController {

  constructor(private readonly userManagment: UserRegisterManagment) { }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createUser(@Body() user: UserDTO) {
    await this.userManagment.executeCreate(user);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  @UseGuards(AuthGuard)
  async updateBalance(@Body() newBalance: { balance : string }, @Req() req) {
    await this.userManagment.executeBalance(parseInt(newBalance.balance), req.headers.userid);
  }

}