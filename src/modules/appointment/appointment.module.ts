import { Module } from "@nestjs/common";

import { LineNotifyService } from "modules/notification/line-notify.service";

import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
  imports: [],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService, LineNotifyService ]
})
export class AppointmentModule {}
