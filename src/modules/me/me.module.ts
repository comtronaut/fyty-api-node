import { Module } from "@nestjs/common";
import { MeController } from "./me.controller";
import { UserSettingsService } from "../user/settings.service";
import { TeamService } from "../team/team.service";
import { AppointmentService } from "../appointment/appointment.service";
import { RoomService } from "../room/room.service";
import { TeamPendingService } from "../team/pending.service";
import { NotifyService } from "../notification/lineNotify.service";
import { UserService } from "../user/user.service";
import { UserAvatarService } from "../user/avatar.service";

@Module({
  imports: [],
  controllers: [ MeController ],
  providers: [
    UserService,
    UserAvatarService,
    UserSettingsService,
    TeamService,
    AppointmentService,
    RoomService,
    TeamPendingService,
    NotifyService
  ]
})
export class MeModule {}
