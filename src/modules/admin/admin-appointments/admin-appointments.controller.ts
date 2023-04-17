import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { AppointmentService } from "src/modules/appointment/appointment.service";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";

@Controller("admins/users")
export class AdminAppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getAll() {
    return this.appointmentService.getAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id")
  async get(@Param("id") appointmentId: string) {
    return this.appointmentService.getById(appointmentId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id/member")
  async getAppointmentMember(@Param("id") appointmentId: string) {
    return this.appointmentService.getMembersById(appointmentId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(":id")
  async update(@Param("id") appiontmentId: string, @Body() payload: UpdateAppointmentDto) {
    return await this.appointmentService.update(appiontmentId, payload);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") appiontmentId: string) {
    return await this.appointmentService.delete(appiontmentId);
  }
}
