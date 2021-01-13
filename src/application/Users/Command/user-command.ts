import { IsString, IsEmail  } from 'class-validator';

export class UserCommand {
    @IsEmail()
    email : string;
    @IsString()
    password : string;
    @IsString()
    firstname : string;
    @IsString()
    lastname : string;
    @IsString()
    dni : string;
    @IsString()
    role : string;
}
