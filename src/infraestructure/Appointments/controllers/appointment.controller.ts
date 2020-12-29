import { Controller, Post, Get, Put, Body, Req, Param, UsePipes, ValidationPipe, Delete, UseGuards, Res } from "@nestjs/common";
import { createAppointmentCase } from "src/application/Appointments/UseCases/createAppointmentCase";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { AuthGuard } from "../adapters/Guard/AuthGuard";
import { Appointments } from "../DBEntities/appointment.entity";

@Controller('api/appointments')
@UseGuards(AuthGuard)
export class AppointmentController {
   constructor(private readonly createAppointment: createAppointmentCase,
      private readonly exceptionRepository: ExceptionRepository) { }
   @Get()
   async getAvailableAppointments(): Promise<Appointments[]> {
      return await this.createAppointment.ExecuteList();
   }

   @UsePipes(new ValidationPipe({ transform: true }))
   @Post()
   async create(@Body() appointment: AppointmentDTO, @Req() req, @Res() res) {
      appointment.idDoctor = req.headers.userid;
      try {
         const e: any = await this.createAppointment.ExecuteCreate(appointment);
         res.status(e.statusCode).send(e.message);
      } catch (e) {
         this.exceptionRepository.createException(e.message, e.statusCode);
      }
   }
   @UsePipes(new ValidationPipe({ transform: true }))
   @Put()
   async selectAppointment(@Body() dto: AppointmentSelectorDTo, @Req() req, @Res() res) {
      dto.userId = req.headers.userid;;
      try {
         const e: any = await this.createAppointment.ExecuteSelector(dto);
         res.status(e.statusCode).send(e.message);
      } catch (e) {
         this.exceptionRepository.createException(e.message, e.statusCode);
      }
   }
   @Put(':id')
   async cancelAppointment(@Param() param, @Req() req, @Res() res) {
      try {
         const e: any = await this.createAppointment.ExecuteCanceller(parseInt(param.id), req.headers.userid);
         res.status(e.statusCode).send(e.message);
      } catch (e) {
         this.exceptionRepository.createException(e.message, e.statusCode);
      }
   }
   @Delete(':id')
   async deleteAppointment(@Param() param, @Req() req, @Res() res) {
      try {
         const e : any = await this.createAppointment.ExecuteDeletor(parseInt(param.id), req.headers.userid);
         res.status(e.statusCode).send(e.message);
      } catch (e) {
         this.exceptionRepository.createException(e.message, e.statusCode);
       }
   }
}