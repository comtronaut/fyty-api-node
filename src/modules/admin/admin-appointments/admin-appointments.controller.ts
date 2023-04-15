import { Body, Controller, Delete, Get, Param, Put, Post, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { AdminAppointmentsService } from "./admin-appointments.service";
import { CreateAppointmentDto, UpdateAppointmentDto } from "src/model/dto/appointment.dto";

@Controller("admins/api/users")
export class AdminAppointmentsController {
  constructor(private readonly appointmentService: AdminAppointmentsService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getAll() {
    return this.appointmentService.getAllAppointment();
  }

  // CRUD
  // @UseGuards(AdminJwtAuthGuard)
  // @Post()
  // async crate(@Body() req: CreateAppointmentDto) {
  //   return this.appointmentService.create(req);
  // }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id")
  async get(@Param("id") appointmentId: string) {
    return this.appointmentService.getAppointment(appointmentId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id/member")
  async getAppointmentMember(@Param("id") appointmentId: string) {
    return this.appointmentService.getAppointmentMember(appointmentId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(":id")
  async update(@Param("id") appiontmentId: string, @Body() req: UpdateAppointmentDto) {
    return await this.appointmentService.update(appiontmentId, req);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") appiontmentId: string) {
    return await this.appointmentService.delete(appiontmentId);
  }
}
