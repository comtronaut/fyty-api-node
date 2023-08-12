import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";

import { UpdateAppointmentDto } from "model/dto/appointment.dto";
import { AppointmentService } from "modules/appointment/appointment.service";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

@Controller("admin/appointments")
@UseGuards(AdminJwtAuthGuard)
export class AdminAppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAllAppointmentsAsAdmin() {
    return await this.appointmentService.getAll();
  }

  @Get(":id")
  async getAppointmentByIdAsAdmin(@Param("id") id: string) {
    return await this.appointmentService.getById(id);
  }

  @Get(":id/members")
  async getAppointmentMembersByAppointmentIdAsAdmin(@Param("id") id: string) {
    return await this.appointmentService.getMembersById(id);
  }

  @Put(":id")
  async updateAppointmentByIdAsAdmin(
    @Param("id") id: string,
    @Body() payload: UpdateAppointmentDto
  ) {
    return await this.appointmentService.update(id, payload);
  }

  @Delete(":id")
  async deleteAppointmentByIdAsAdmin(@Param("id") id: string) {
    return await this.appointmentService.deleteById(id, true);
  }
}
