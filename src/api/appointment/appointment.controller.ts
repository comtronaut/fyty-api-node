import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { CreateAppointmentDto, UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { User } from "src/model/sql-entity/user/user.entity";
import { AppointmentService } from "./appointment.service";

@Controller("api/appointments")
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() req: CreateAppointmentDto) {
    return this.appointmentService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(
    @Param("roomId") roomId: string,
    @Param("teamId") teamId: string
  ) {
    return this.appointmentService.getAppointment(roomId, teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserAppointmnet(
    @Subject() user: User
  ) {
    return this.appointmentService.getAppointmentByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") appiontmentId: string, 
    @Body() req: UpdateAppointmentDto,
    ) {
    return await this.appointmentService.update(appiontmentId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Param("id") appiontmentId: string
    ) {    
    return await this.appointmentService.delete(appiontmentId);
  }
}
