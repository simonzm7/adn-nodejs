import { DBRepository } from 'src/domain/UserActions/Users/repositories/DB/DBRepository';
import { UserBussinessLogicRepository } from 'src/domain/UserActions/Users/repositories/Users/UserBussinessLogicRepository';
import { UserBussinessLogic } from 'src/domain/UserActions/Users/Validations/UserBussinessLogic';
import { abstractUser } from '../../../domain/UserActions/Users/repositories/Users/abstractUser';
import { DBAdapter } from '../adapters/DBAdapter';
import { UserAdapter } from '../adapters/UserAdapter';
export const MergeProvider = {
    provide: abstractUser,
    useClass: UserAdapter
}

export const MergeDB = {
    provide: DBRepository,
    useClass: DBAdapter
}

export const MergeValidations = {
    provide: UserBussinessLogicRepository,
    useClass: UserBussinessLogic
}
