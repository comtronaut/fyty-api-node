import { Module } from "@nestjs/common";
import { NotifyService } from "../notification/lineNotify.service";
import { LineupController } from "./lineup.controller";
import { LineupService } from "./lineup.service";
import { TeamMemberService } from "./member.service";
import { TeamPendingService } from "./pending.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { AppointmentService } from "../appointment/appointment.service";

@Module({
  imports: [],
  controllers: [ TeamController, LineupController ],
  providers: [ TeamService, LineupService, TeamMemberService, TeamPendingService, AppointmentService, NotifyService ]
})
export class TeamModule {}
