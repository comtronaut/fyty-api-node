import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment, AppointmentMember } from "src/model/sql-entity/appointment.entity";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([ Appointment, AppointmentMember ])
  ],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService ]
})
export class AppointmentModule { }
