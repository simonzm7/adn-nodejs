import { RepositoryUser } from 'src/domain/UserActions/Users/port/User/repository/repository-user';
import { RepositoryUserMysql } from '../../adapters/repository/repository-user-mysql';



export const RepositoryUserProvider = {
    provide: RepositoryUser,
    useClass: RepositoryUserMysql
}
