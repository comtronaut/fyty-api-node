import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment, AppointmentMember } from "src/model/sql-entity/appointment.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([ Appointment, AppointmentMember,TeamMember ])
  ],
  controllers: [ AppointmentController ],
  providers: [ AppointmentService ]
})
export class AppointmentModule { }
