import { Controller, Post, Body, Res, UsePipes, ValidationPipe, UseGuards, HttpStatus, Req, Get } from '@nestjs/common';
import { QueryUser } from 'src/application/UserAuthentication/Query/query-user-handler';
import AuthUserHandler from 'src/application/UserAuthentication/Command/auth-user-handler';
import { AuthGuard } from 'src/infraestructure/Appointments/adapters/Guard/AuthGuard';
import { UserDto } from 'src/application/UserAuthentication/Query/DTO/user.dto';
import AuthCommand from 'src/application/UserAuthentication/Command/auth-command';



@Controller('api/auth')
export default class UserAuthenticationController {
    constructor(private readonly authManagment: AuthUserHandler,
        private readonly queryUser: QueryUser) { }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Post()
    async logIn(@Body() credentials: AuthCommand, @Res() res) {
        await this.authManagment.executeLogin(credentials);
    }



    @UseGuards(AuthGuard)
    @Get('me')
    async IsAuthenticated(@Req() req, @Res() res) {
        const user: UserDto = await this.queryUser.executeQuery(req.headers.userid);
        return res.status(HttpStatus.OK).json({ message: { code: 'user_me', data: user }});
    }

}