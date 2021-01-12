import { Injectable } from "@nestjs/common";
import { SuccessExcp } from "src/domain/Exceptions/SuccessExcp";
import { QueryRepository } from "src/domain/UserActions/UserAuthentication/Repository/QueryRepository";
import { DBRepository } from "src/domain/UserActions/Users/repositories/DB/DBRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


@Injectable()
export class QueryAdapter implements QueryRepository {
    constructor(private readonly dbRepository : DBRepository) {}

    async getUser(userId : number)
    {
        const user : User = await this.dbRepository.findOneById(userId);
        const selectedData : {} = {
            balance: user.balance,
            role: user.role,
            name: user.firstname + ' ' + user.lastname
        }
        throw new SuccessExcp({code: 'user_me', data: selectedData});
    }
}
// gerencias
// producción
// comercial y de ventas
// infraestructura
// tecnica
// adminitrativa