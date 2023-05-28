import { Module } from "@nestjs/common";

import { LineupController } from "./lineup.controller";
import { LineupService } from "./lineup.service";
import { TeamMemberService } from "./member.service";
import { TeamPendingService } from "./pending.service";
import { TeamSettingsService } from "./settings.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { TrainingService } from "./training.service";
import { AppointmentService } from "../appointment/appointment.service";
import { NotifyService } from "../notification/lineNotify.service";
import { RoomService } from "../room/room.service";

@Module({
  imports: [],
  controllers: [ TeamController, LineupController ],
  providers: [
    TeamService,
    LineupService,
    TeamMemberService,
    TeamSettingsService,
    TeamPendingService,
    AppointmentService,
    RoomService,
    TrainingService,
    NotifyService
  ]
})
export class TeamModule {}
