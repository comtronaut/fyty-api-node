import { Module } from "@nestjs/common";

import { AppointmentService } from "modules/appointment/appointment.service";
import { LineNotifyService } from "modules/notification/line-notify.service";
import { NotificationService } from "modules/notification/notification.service";
import { RoomService } from "modules/room/room.service";
import { TeamPendingService } from "modules/team/services/pending.service";
import { TeamService } from "modules/team/services/team.service";
import { UserAvatarService } from "modules/user/services/avatar.service";
import { UserSettingsService } from "modules/user/services/settings.service";
import { UserService } from "modules/user/services/user.service";

import { MeController } from "./me.controller";

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
    LineNotifyService,
    NotificationService
  ]
})
export class MeModule {}
