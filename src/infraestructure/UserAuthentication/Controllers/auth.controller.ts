import { Controller, Post, Body, Res, UsePipes, ValidationPipe, UseGuards, HttpStatus, Req, Get } from "@nestjs/common";
import { QueryUser } from "src/application/UserAuthentication/UsesCases/Query/QueryUser";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/Command/UserLoginManagement";
import LoginDTO from "src/domain/UserActions/UserAuthentication/Repository/DTO/LoginDTO";
import { AuthGuard } from "src/infraestructure/Appointments/adapters/Guard/AuthGuard";



@Controller('api/auth')
export default class UserAuthenticationController {
    constructor(private readonly authManagment : UserLoginManagement,
        private readonly queryUser : QueryUser) {}

    @UsePipes(new ValidationPipe({transform : true}))
    @Post()
    async logIn(@Body() credentials : LoginDTO, @Res() res) {
        await this.authManagment.executeLogin(credentials);
    }



    @UseGuards(AuthGuard)
    @Get('me')
    async IsAuthenticated(@Req() req)
    {
        await this.queryUser.executeQuery(req.headers.userid);
    }

}