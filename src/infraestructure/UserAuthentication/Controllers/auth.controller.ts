import { Controller, Post, Body, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/UserLoginManagement";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";



@Controller('api/auth')
export default class UserAuthenticationController {
    constructor(private readonly authManagment : UserLoginManagement,
        private readonly exceptionRepository : ExceptionRepository) {}
    @UsePipes(new ValidationPipe({transform : true}))
    @Post()
    async logIn(@Body() credentials : LoginDTO, @Res() res) {
        try{
            const e : any = await this.authManagment.ExecuteLogin(credentials);
            res.status(e.statusCode).send(e.message);
        }catch (e){
            this.exceptionRepository.createException(e.message, e.statusCode);
        }
    }
}