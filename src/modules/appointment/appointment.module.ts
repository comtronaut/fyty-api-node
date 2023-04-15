import { Module } from "@nestjs/common";
import { NotifyService } from "../notification/lineNotify.service";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
  imports: [],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService, NotifyService ]
})
export class AppointmentModule {}
