import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/infraestructure/Users/EntityManager/user.entity';
import { UserModel } from '../models/UserModel';
import { abstractUser } from '../repositories/Users/abstractUser';
import { ValidationsRepository } from '../repositories/Validations/ValidationsRepository';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: abstractUser,
    private readonly userValidations: ValidationsRepository) { }

  public async Execute(user: UserModel): Promise<{}> {

    return new Promise(async (resolve, reject) => {
      if (user.getErrors.length > 0)
        reject({ message: user.getErrors, statusCode: HttpStatus.BAD_REQUEST });
      else {
        if (!(await this.userValidations.UserAlreadyExists(user.get_email, user.get_dni)))
          resolve(this.userRepository.createUser(user));

        reject({ message: 'User Already Exists', statusCode: HttpStatus.BAD_REQUEST });
      }
    });
  }

  public async ExecuteBalance(balance: number, userId): Promise<{}> {
    return new Promise(async (resolve, reject) => {
      const user: User = await this.userRepository.findUserByIdAndReturn(userId);
      if (!user)
        reject({ message: 'El usuario no existe', statusCode: HttpStatus.BAD_REQUEST });
      else {
        const balanceError: number = this.userValidations.VerifyBalancaCapacity(Number(balance), Number(user.balance));
        if (balanceError >= 0)
          reject({ message: `Solo puede ingresar el balance de : ${balanceError}`, statusCode: HttpStatus.BAD_REQUEST });
        else
          resolve(this.userRepository.updateBalance(balance, user));
      }
    });

  }
}