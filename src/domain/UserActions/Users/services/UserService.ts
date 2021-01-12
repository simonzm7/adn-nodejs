import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/UserModel';
import { abstractUser } from '../repositories/Users/abstractUser';
import { UserBussinessLogicRepository } from '../repositories/Users/UserBussinessLogicRepository';
import { UserBussinessLogic } from '../Validations/UserBussinessLogic';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: abstractUser,
    private readonly userBussinessLogic : UserBussinessLogicRepository) { }

  public async executeCreate(user: UserModel) {
    await this.userBussinessLogic.userAlreadyExists(user.get_email, user.get_dni);
    await this.userRepository.createUser(user);
  }

}