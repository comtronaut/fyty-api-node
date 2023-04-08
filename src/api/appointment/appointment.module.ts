import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";
import { NotifyService } from "../line_notify/lineNotify.service";

@Module({
  imports: [],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService, PrismaService, NotifyService ]
})
export class AppointmentModule {}
