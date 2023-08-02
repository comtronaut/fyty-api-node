import { Module } from "@nestjs/common";

import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";
import { NotifyService } from "../notification/line-notify.service";

@Module({
  imports: [],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService, NotifyService ]
})
export class AppointmentModule {}
