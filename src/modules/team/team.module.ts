import { Module } from "@nestjs/common";

import { AppointmentService } from "modules/appointment/appointment.service";
import { LineNotifyService } from "modules/notification/line-notify.service";
import { RoomService } from "modules/room/room.service";

import { LineupController } from "./controllers/lineup.controller";
import { TeamController } from "./controllers/team.controller";
import { LineupService } from "./services/lineup.service";
import { TeamMemberService } from "./services/member.service";
import { TeamPendingService } from "./services/pending.service";
import { TeamSettingsService } from "./services/settings.service";
import { TeamService } from "./services/team.service";
import { TrainingService } from "./services/training.service";

@Module({
  imports: [],
  controllers: [ TeamController, LineupController ],
  providers: [
    TeamService,
    LineupService,
    TeamMemberService,
    TeamSettingsService,
    TeamPendingService,
    TrainingService,
    AppointmentService,
    RoomService,
    LineNotifyService
  ]
})
export class TeamModule {}
