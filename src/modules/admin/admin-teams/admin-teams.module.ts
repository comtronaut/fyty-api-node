import { Module } from "@nestjs/common";

import { NotifyService } from "modules/notification/line-notify.service";
import { RoomService } from "modules/room/room.service";
import { TeamService } from "modules/team/team.service";

import { AdminTeamsController } from "./admin-teams.controller";

@Module({
  controllers: [ AdminTeamsController ],
  providers: [ TeamService, RoomService, NotifyService ]
})
export class AdminTeamsModule {}
