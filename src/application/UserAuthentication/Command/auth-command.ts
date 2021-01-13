import { IsEmail, IsString } from 'class-validator';

export default class AuthCommand {
    @IsEmail()
    email : string;
    
    @IsString()
    password : string;
}