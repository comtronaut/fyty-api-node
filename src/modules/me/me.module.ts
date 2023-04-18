import { Module } from "@nestjs/common";
import { AppointmentService } from "../appointment/appointment.service";
import { NotifyService } from "../notification/lineNotify.service";
import { TeamPendingService } from "../team/pending.service";
import { TeamService } from "../team/team.service";
import { UserAvatarService } from "../user/avatar.service";
import { UserSettingsService } from "../user/settings.service";
import { UserService } from "../user/user.service";
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
    NotifyService
  ]
})
export class MeModule {}
