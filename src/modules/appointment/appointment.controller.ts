import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards
} from "@nestjs/common";

import { UpdateAppointmentDto } from "model/dto/appointment.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { TrainingService } from "modules/team/services/training.service";

import { AppointmentService } from "./appointment.service";

@Controller("appointments")
@UseGuards(UserJwtAuthGuard)
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly trainingService: TrainingService
  ) {}

  @Get(":id/training")
  async getTrainingByAppointmentId(@Param("id") appiontmentId: string) {
    return await this.trainingService.getByAppointmentId(appiontmentId);
  }

  @Put(":id")
  async updateAppointmentById(@Param("id") appiontmentId: string, @Body() payload: UpdateAppointmentDto) {
    return await this.appointmentService.update(appiontmentId, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAppointmentById(@Param("id") appiontmentId: string): Promise<void> {
    return await this.appointmentService.deleteById(appiontmentId, true);
  }
}
