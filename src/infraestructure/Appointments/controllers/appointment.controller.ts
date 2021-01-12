import { Controller, Post, Get, Put, Body, Req, Param, UsePipes, ValidationPipe, Delete, UseGuards, Res, HttpStatus } from "@nestjs/common";
import { CommandAppointmentCase } from "src/application/Appointments/UseCases/command/CommandAppointmentCase";
import { QueryAppointmentCase } from "src/application/Appointments/UseCases/query/QueryAppointmentCase";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { LessThan, Not } from "typeorm";
import { AuthGuard } from "../adapters/Guard/AuthGuard";
import { Appointments } from "../DBEntities/appointment.entity";

@Controller('api/appointments')
@UseGuards(AuthGuard)
export class AppointmentController {
   constructor(private readonly queryAppointment: QueryAppointmentCase,
      private readonly commandAppointment: CommandAppointmentCase) { }

   @Get()
   async getAvailableAppointments(@Res() res, @Req() req): Promise<Appointments[]> {
      return res.status(HttpStatus.OK).json({
         message: await this.queryAppointment.executeList()
      });
   }
   @Get('me')
   async getMyAppointments(@Res() res, @Req() req): Promise<Appointments[]> {
      return res.status(HttpStatus.OK).json({
         message: await this.queryAppointment.executeMyList([{ idUser: req.headers.userid }])
      });
   }

   @Get('agenda')
   async getDoctorAgenda(@Res() res, @Req() req): Promise<Appointments[]> {
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
   async create(@Body() appointment: AppointmentDTO, @Req() req, @Res() res) {
      appointment.idDoctor = req.headers.userid;
      await this.commandAppointment.executeCreate(appointment);
   }
   @UsePipes(new ValidationPipe({ transform: true }))
   @Put()
   async selectAppointment(@Body() dto: AppointmentSelectorDTo, @Req() req, @Res() res) {
      dto.userId = req.headers.userid;
      await this.commandAppointment.executeSelector(dto);
   }
   @Put(':id')
   async cancelAppointment(@Param() param, @Req() req, @Res() res) {
      await this.commandAppointment.executeCanceller(parseInt(param.id), req.headers.userid);
   }
   @Delete(':id')
   async deleteAppointment(@Param() param, @Req() req, @Res() res) {
      await this.commandAppointment.executeDeletor(parseInt(param.id), req.headers.userid);
   }
}