import { DaoAuth } from 'src/domain/UserActions/UserAuthentication/port/dao/dao-auth'
import { DaoAuthMysql } from '../../Adapters/dao/dao-auth-mysql'

export const MergeDaoAdapter = {
    provide: DaoAuth,
    useClass: DaoAuthMysql
}
