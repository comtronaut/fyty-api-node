import { Module } from "@nestjs/common";
import { AppointmentService } from "modules/appointment/appointment.service";
import { AdminAppointmentsController } from "./admin-appointments.controller";

@Module({
  controllers: [ AdminAppointmentsController ],
  providers: [ AppointmentService ]
})
export class AdminAppoinmentsModule {}
