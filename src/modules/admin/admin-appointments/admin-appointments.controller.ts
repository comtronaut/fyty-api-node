import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { AppointmentService } from "src/modules/appointment/appointment.service";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";

@Controller("admin/users")
@UseGuards(AdminJwtAuthGuard)
export class AdminAppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAll() {
    return this.appointmentService.getAll();
  }

  @Get(":id")
  async get(@Param("id") appointmentId: string) {
    return this.appointmentService.getById(appointmentId);
  }

  @Get(":id/member")
  async getAppointmentMember(@Param("id") appointmentId: string) {
    return this.appointmentService.getMembersById(appointmentId);
  }

  @Put(":id")
  async update(@Param("id") appiontmentId: string, @Body() payload: UpdateAppointmentDto) {
    return await this.appointmentService.update(appiontmentId, payload);
  }

  @Delete(":id")
  async delete(@Param("id") appiontmentId: string) {
    return await this.appointmentService.delete(appiontmentId, true);
  }
}
