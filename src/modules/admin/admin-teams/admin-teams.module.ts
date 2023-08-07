import { Module } from "@nestjs/common";

import { LineNotifyService } from "modules/notification/line-notify.service";
import { RoomService } from "modules/room/room.service";
import { TeamService } from "modules/team/services/team.service";

import { AdminTeamsController } from "./admin-teams.controller";

@Module({
  controllers: [ AdminTeamsController ],
  providers: [ TeamService, RoomService, LineNotifyService ]
})
export class AdminTeamsModule {}
