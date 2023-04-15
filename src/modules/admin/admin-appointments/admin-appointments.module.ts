import { Module } from "@nestjs/common";
import { AppointmentService } from "src/modules/appointment/appointment.service";
import { AdminAppointmentsController } from "./admin-appointments.controller";

@Module({
  controllers: [ AdminAppointmentsController ],
  providers: [ AppointmentService ]
})
export class AdminAppoinmentsModule {}
