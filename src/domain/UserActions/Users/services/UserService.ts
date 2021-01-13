import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { RepositoryUser } from '../port/User/repository/repository-user';
import { UsersValidationsRepository } from '../port/Validations/repository/user-validations-repository';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: RepositoryUser,
    private readonly userValidations : UsersValidationsRepository) { }

  public async executeCreate(user: User) {
    await this.userValidations.userAlreadyExists(user.get_email, user.get_dni);
    await this.userRepository.createOne(user);
  }

}
