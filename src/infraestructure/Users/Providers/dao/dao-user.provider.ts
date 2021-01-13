import { DaoUser } from 'src/domain/UserActions/Users/port/User/dao/dao-user';
import { DaoUserMysql } from '../../adapters/dao/dao-user-mysql';


export const DaoUserProvider = {
    provide: DaoUser,
    useClass: DaoUserMysql
}