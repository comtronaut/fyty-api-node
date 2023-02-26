import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";
import { UserJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserSubject } from "src/common/subject.decorator";
import {
  CreateAppointmentDto,
  UpdateAppointmentDto
} from "src/model/dto/appointment.dto";
import { AppointmentService } from "./appointment.service";

@Controller("api/appointments")
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(UserJwtAuthGuard)
  @Post()
  async add(@Body() req: CreateAppointmentDto) {
    return this.appointmentService.create(req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async get(@Query("roomId") roomId: string, @Query("teamId") teamId: string) {
    return this.appointmentService.getAppointment(roomId, teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("/me")
  async getUserAppointmnet(@UserSubject() user: User) {
    return await this.appointmentService.getAppointmentByUserId(user.id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") appiontmentId: string,
    @Body() req: UpdateAppointmentDto
  ) {
    return await this.appointmentService.update(appiontmentId, req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") appiontmentId: string) {
    return await this.appointmentService.delete(appiontmentId);
  }
}
