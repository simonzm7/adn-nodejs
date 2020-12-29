import { Controller, Post, Body, Res, Put, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import ExceptionRepository from 'src/domain/Exceptions/Repository/ExceptionRepository';
import { UserDTO } from 'src/domain/Users/repositories/Users/DTO/UserDTO';
import { AuthGuard } from 'src/infraestructure/Appointments/adapters/Guard/AuthGuard';

@Controller('api/user')
export class UserController {

  constructor(private readonly userManagment: UserRegisterManagment,
    private readonly exceptionRepository: ExceptionRepository) { }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createUser(@Body() user: UserDTO, @Res() res) {
    try {
      const e: any = await this.userManagment.Execute(user);
      res.status(e.statusCode).send(e.message);
    } catch (e) {
      this.exceptionRepository.createException(e.message, e.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  async updateBalance(@Body() newBalance: any, @Req() req, @Res() res) {
    try {
      const e: any = await this.userManagment.ExecuteBalance(newBalance.balance, req.headers.userid);
      res.status(e.statusCode).send(e.message);
    } catch (e) {
      this.exceptionRepository.createException(e.message, e.statusCode);
    }
  }
}