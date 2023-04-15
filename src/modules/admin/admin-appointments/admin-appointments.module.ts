import { Module } from "@nestjs/common";
import { AdminAppointmentsController } from "./admin-appointments.controller";
import { AdminAppointmentsService } from "./admin-appointments.service";

@Module({
  controllers: [ AdminAppointmentsController ],
  providers: [ AdminAppointmentsService ]
})
export class AdminAppoinmentsModule {}
