import { Controller, Post, Get, Put, Body, Req, Param, UsePipes, ValidationPipe, Delete, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { CommandAppointmentHandler } from 'src/application/Appointments/command/command-appointment-handler';
import { CommandCreateAppointment } from 'src/application/Appointments/command/command-create-appointment';
import { CommandSelectorAppointment } from 'src/application/Appointments/command/command-selector-appointment';
import { QueryAppointmentHandler } from 'src/application/Appointments/query/query-appointment-handler';
import { LessThan, Not } from 'typeorm';
import { AuthGuard } from '../../Configuration/Guard/AuthGuard';
import { AppointmentEntity } from '../Entity/appointment.entity';

@Controller('api/appointments')
@UseGuards(AuthGuard)
export class AppointmentController {
   constructor(private readonly queryAppointment: QueryAppointmentHandler,
      private readonly commandAppointment: CommandAppointmentHandler) { }

   @Get()
   async getAvailableAppointments(@Res() res, @Req() req): Promise<AppointmentEntity[]> {
      return res.status(HttpStatus.OK).json({
         message: await this.queryAppointment.executeList()
      });
   }
   @Get('me')
   async getMyAppointments(@Res() res, @Req() req): Promise<AppointmentEntity[]> {
      return res.status(HttpStatus.OK).json({
         message: await this.queryAppointment.executeMyList([{ idUser: req.headers.userid }])
      });
   }

   @Get('agenda')
   async getDoctorAgenda(@Res() res, @Req() req): Promise<AppointmentEntity[]> {
      return res.status(HttpStatus.OK).json({
         message: await this.queryAppointment.executeAgendaList([{
            idDoctor: req.headers.userid,
            appointmentStatus: 1
         },
         {
            idDoctor: req.headers.userid,
            appointmentStatus: 2,
            idUser: Not(LessThan(0))
         }
         ])
      });
   }

   @UsePipes(new ValidationPipe({ transform: true }))
   @Post()
   async create(@Body() appointment: CommandCreateAppointment, @Req() req) {
      appointment.idDoctor = req.headers.userid;
      await this.commandAppointment.executeCreate(appointment);
   }
   @UsePipes(new ValidationPipe({ transform: true }))
   @Put()
   async selectAppointment(@Body() dto: CommandSelectorAppointment, @Req() req, @Res() res) {
      dto.userId = req.headers.userid;
      await this.commandAppointment.executeSelector(dto);
   }

   @Put(':id')
   async cancelAppointment(@Param() param, @Req() req) {
      await this.commandAppointment.executeCanceller(+(param.id), req.headers.userid);
   }


   @Delete(':id')
   async deleteAppointment(@Param() param, @Req() req){
      await this.commandAppointment.executeDeletor(+(param.id), req.headers.userid);
   }
}
