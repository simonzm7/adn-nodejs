import { UserEntity } from 'src/infraestructure/Users/Entity/user.entity';
import { User } from '../../../models/User';

export abstract class RepositoryUser {
    public abstract createOne(user : User);
    public abstract updateUser(user : UserEntity, idAppointment?: number);
}