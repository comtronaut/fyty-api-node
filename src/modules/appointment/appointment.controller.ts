import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserSubject } from "src/common/subject.decorator";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { AppointmentService } from "./appointment.service";

@Controller("appointments")
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async get(@Query("roomId") roomId: string, @Query("teamId") teamId: string) {
    return this.appointmentService.getAppointment(roomId, teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async update(@Param("id") appiontmentId: string, @Body() payload: UpdateAppointmentDto) {
    return await this.appointmentService.update(appiontmentId, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") appiontmentId: string) {
    return await this.appointmentService.delete(appiontmentId);
  }
}
