import { Body, Controller, Delete, Param, Put, UseGuards } from "@nestjs/common";

import { UpdateAppointmentDto } from "model/dto/appointment.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { AppointmentService } from "./appointment.service";

@Controller("appointments")
@UseGuards(UserJwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Put(":id")
  async update(@Param("id") appiontmentId: string, @Body() payload: UpdateAppointmentDto) {
    return await this.appointmentService.update(appiontmentId, payload);
  }

  @Delete(":id")
  async delete(@Param("id") appiontmentId: string) {
    return await this.appointmentService.deleteById(appiontmentId, true);
  }
}
