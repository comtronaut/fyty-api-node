import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
  imports: [],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService, PrismaService ]
})
export class AppointmentModule {}
