import { Module } from "@nestjs/common";

import { MeController } from "./me.controller";
import { AppointmentService } from "../appointment/appointment.service";
import { LineNotifyService } from "../notification/line-notify.service";
import { RoomService } from "../room/room.service";
import { TeamPendingService } from "../team/services/pending.service";
import { TeamService } from "../team/services/team.service";
import { UserAvatarService } from "../user/services/avatar.service";
import { UserSettingsService } from "../user/services/settings.service";
import { UserService } from "../user/services/user.service";

@Module({
  imports: [],
  controllers: [ MeController ],
  providers: [
    UserService,
    UserAvatarService,
    UserSettingsService,
    TeamService,
    AppointmentService,
    TeamPendingService,
    RoomService,
    LineNotifyService
  ]
})
export class MeModule {}
