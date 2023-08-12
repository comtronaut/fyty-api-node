import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards
} from "@nestjs/common";

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
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") appiontmentId: string): Promise<void> {
    return await this.appointmentService.deleteById(appiontmentId, true);
  }
}
