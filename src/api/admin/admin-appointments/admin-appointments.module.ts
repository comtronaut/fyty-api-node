import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AdminAppointmentsController } from "./admin-appointments.controller";
import { AdminAppointmentsService } from "./admin-appointments.service";

@Module({
  controllers: [ AdminAppointmentsController ],
  providers: [ AdminAppointmentsService, PrismaService ]
})
export class AdminAppoinmentsModule {}
